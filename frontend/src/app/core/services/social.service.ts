import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Friend {
  _id: string;
  username: string;
  level: number;
  totalXP: number;
}

export interface FriendRequest {
  _id: string;
  from: {
    _id: string;
    username: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface HabitGroup {
  _id: string;
  name: string;
  description: string;
  members: any[];
  inviteCode: string;
  isPrivate: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private apiUrl = 'http://localhost:3000/api/social';

  constructor(private http: HttpClient) {}

  sendFriendRequest(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/friend-request`, { username });
  }

  respondToFriendRequest(requestId: string, action: 'accept' | 'reject'): Observable<any> {
    return this.http.post(`${this.apiUrl}/friend-request/respond`, { requestId, action });
  }

  getFriends(): Observable<{ friends: Friend[], pendingRequests: FriendRequest[] }> {
    return this.http.get<{ friends: Friend[], pendingRequests: FriendRequest[] }>(`${this.apiUrl}/friends`);
  }

  createHabitGroup(name: string, description: string, isPrivate: boolean): Observable<HabitGroup> {
    return this.http.post<HabitGroup>(`${this.apiUrl}/groups`, { name, description, isPrivate });
  }

  joinHabitGroup(inviteCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/groups/join`, { inviteCode });
  }
}