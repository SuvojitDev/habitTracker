import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal';
  category: string;
  xpReward: number;
  participants: any[];
  completions: any[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'http://localhost:3000/api/challenges';

  constructor(private http: HttpClient) {}

  getChallenges(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(`${this.apiUrl}/list`);
  }

  joinChallenge(challengeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${challengeId}/join`, {});
  }

  completeChallenge(challengeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${challengeId}/complete`, {});
  }
}