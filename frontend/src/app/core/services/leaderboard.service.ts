import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  totalXP: number;
  level: number;
  userId: string;
}

export interface UserRank {
  rank: number;
  totalXP: number;
  level: number;
  username: string;
  percentile: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = 'https://habittracker-nsf3.onrender.com/api/leaderboard';

  constructor(private http: HttpClient) {}

  getLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/top`);
  }

  getUserRank(): Observable<UserRank> {
    return this.http.get<UserRank>(`${this.apiUrl}/rank`);
  }
}