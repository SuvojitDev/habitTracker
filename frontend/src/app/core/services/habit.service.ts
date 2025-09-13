import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit, CreateHabitRequest, CompleteHabitResponse } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = 'https://habittracker-nsf3.onrender.com/api/habits';

  constructor(private http: HttpClient) {}

  getHabits(): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/list`);
  }

  createHabit(habit: CreateHabitRequest): Observable<Habit> {
    return this.http.post<Habit>(`${this.apiUrl}/create`, habit);
  }

  completeHabit(habitId: string): Observable<CompleteHabitResponse> {
    return this.http.post<CompleteHabitResponse>(`${this.apiUrl}/${habitId}/complete`, {});
  }

  deleteHabit(habitId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${habitId}`);
  }
}