import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  totalXP: number;
  level: number;
  createdAt: Date;
  stats: any;
}

export interface PaginatedResponse<T> {
  data?: T[];
  users?: T[];
  habits?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  stats: {
    userCount: number;
    habitCount: number;
    challengeCount: number;
    achievementCount: number;
  };
  recentUsers: AdminUser[];
  topUsers: AdminUser[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private currentAdminSubject = new BehaviorSubject<any>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAdminFromStorage();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  setCurrentAdmin(adminData: any): void {
    localStorage.setItem('adminToken', adminData.token);
    localStorage.setItem('admin', JSON.stringify(adminData.admin));
    this.currentAdminSubject.next(adminData.admin);
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    this.currentAdminSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getUsers(page: number = 1, limit: number = 10, search: string = '', sortBy: string = 'createdAt', sortOrder: string = 'desc'): Observable<PaginatedResponse<AdminUser>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<AdminUser>>(`${this.apiUrl}/users`, { params });
  }

  getHabits(page: number = 1, limit: number = 10, search: string = '', category: string = ''): Observable<PaginatedResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/habits`, { params });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  updateUserXP(userId: string, totalXP: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/xp`, { totalXP });
  }

  clearAllData(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear-all`);
  }

  getSystemAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`);
  }

  private loadAdminFromStorage(): void {
    const admin = localStorage.getItem('admin');
    if (admin) {
      this.currentAdminSubject.next(JSON.parse(admin));
    }
  }
}