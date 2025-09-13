export interface User {
  id: string;
  username: string;
  email: string;
  totalXP: number;
  level: number;
  achievements: Achievement[];
  stats: UserStats;
  isAdmin?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  unlockedAt: Date;
}

export interface UserStats {
  totalHabitsCompleted: number;
  longestOverallStreak: number;
  perfectWeeks: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}