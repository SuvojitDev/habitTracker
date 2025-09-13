export interface Habit {
  _id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetFrequency: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
  completions: HabitCompletion[];
  isActive: boolean;
  createdAt: Date;
}

export interface HabitCompletion {
  date: Date;
  xpEarned: number;
  bonusMultiplier: number;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetFrequency: number;
}

export interface CompleteHabitResponse {
  habit: Habit;
  xpEarned: number;
  bonusMultiplier: number;
  newLevel: number;
  achievements: any[];
  streakBroken: boolean;
}