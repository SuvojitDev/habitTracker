import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HabitService } from '../../core/services/habit.service';
import { LeaderboardService } from '../../core/services/leaderboard.service';
import { User } from '../../core/models/user.model';
import { Habit } from '../../core/models/habit.model';
import { UserRank } from '../../core/services/leaderboard.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-all duration-300 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">🎯 HabitTracker</h1>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/challenges" 
                 class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base">
                <span class="hidden sm:inline">🎯 Challenges</span>
                <span class="sm:hidden">🎯</span>
              </a>
              <a routerLink="/social" 
                 class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base">
                <span class="hidden sm:inline">👥 Social</span>
                <span class="sm:hidden">👥</span>
              </a>
              <a routerLink="/leaderboard" 
                 class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base">
                <span class="hidden sm:inline">🏆 Leaderboard</span>
                <span class="sm:hidden">🏆</span>
              </a>
              <a *ngIf="user?.isAdmin" routerLink="/admin" 
                 class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base">
                <span class="hidden sm:inline">🔐 Admin Panel</span>
                <span class="sm:hidden">🔐</span>
              </a>
              <app-theme-toggle></app-theme-toggle>
              <div class="text-right">
                <p class="text-sm text-gray-600 dark:text-gray-300">Welcome back,</p>
                <p class="font-semibold text-gray-900 dark:text-white">{{ user?.username }}</p>
                <p *ngIf="user?.isAdmin" class="text-xs text-red-600 dark:text-red-400 font-bold">🔐 ADMIN</p>
              </div>
              <button 
                (click)="logout()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex items-center justify-center min-h-96">
          <app-loader text="Loading your dashboard..."></app-loader>
        </div>

        <div *ngIf="!loading">
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-xs sm:text-sm">Level</p>
                <p class="text-2xl sm:text-3xl font-bold animate-pulse">{{ user?.level }}</p>
              </div>
              <img loading="lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🏆%3C/text%3E%3C/svg%3E" alt="Trophy" class="w-8 h-8 sm:w-12 sm:h-12 animate-bounce">
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-xs sm:text-sm">Total XP</p>
                <p class="text-xl sm:text-3xl font-bold">{{ user?.totalXP | number }}</p>
              </div>
              <img loading="lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E⭐%3C/text%3E%3C/svg%3E" alt="Star" class="w-8 h-8 sm:w-12 sm:h-12 animate-spin-slow">
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-xs sm:text-sm">Rank</p>
                <p class="text-2xl sm:text-3xl font-bold">#{{ userRank?.rank }}</p>
              </div>
              <img loading="lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🥇%3C/text%3E%3C/svg%3E" alt="Gold Medal" class="w-8 h-8 sm:w-12 sm:h-12 animate-pulse">
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100 text-xs sm:text-sm">Completed</p>
                <p class="text-2xl sm:text-3xl font-bold">{{ user?.stats?.totalHabitsCompleted }}</p>
              </div>
              <img loading="lazy" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E✅%3C/text%3E%3C/svg%3E" alt="Check" class="w-8 h-8 sm:w-12 sm:h-12 animate-bounce">
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Habits Section -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Today's Habits</h2>
                <button 
                  (click)="showCreateHabit = true"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  <span class="hidden sm:inline">+ Add Habit</span>
                  <span class="sm:hidden">+ New Habit</span>
                </button>
              </div>

              <div *ngIf="habitsLoading" class="text-center py-8">
                <app-loader text="Creating habit..."></app-loader>
              </div>

              <div *ngIf="habits.length === 0 && !habitsLoading" class="text-center py-12">
                <div class="text-6xl mb-4">🎯</div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No habits yet</h3>
                <p class="text-gray-600 dark:text-gray-300">Create your first habit to start your journey!</p>
              </div>

              <div class="space-y-4">
                <div *ngFor="let habit of habits" 
                     class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in">
                  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div class="flex-1 w-full sm:w-auto">
                      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ habit.name }}</h3>
                        <span class="px-2 py-1 text-xs rounded-full w-fit transition-all duration-200 hover:scale-110"
                              [ngClass]="{
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': habit.difficulty === 'easy',
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': habit.difficulty === 'medium',
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': habit.difficulty === 'hard'
                              }">
                          {{ habit.difficulty }}
                        </span>
                      </div>
                      <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1">{{ habit.description }}</p>
                      <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                        <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">🔥 {{ habit.currentStreak }} day streak</span>
                        <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">📈 Best: {{ habit.longestStreak }}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        (click)="completeHabit(habit._id)"
                        [disabled]="isCompletedToday(habit)"
                        class="px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md text-xs sm:text-sm flex-1 sm:flex-none"
                        [ngClass]="{
                          'bg-green-500 hover:bg-green-600 text-white': !isCompletedToday(habit),
                          'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed': isCompletedToday(habit)
                        }"
                      >
                        {{ isCompletedToday(habit) ? '✓ Done' : 'Complete' }}
                      </button>
                      <button 
                        (click)="deleteHabit(habit._id)"
                        class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 sm:p-2 transition-all duration-200 transform hover:scale-110 active:scale-95"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Achievements -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">🏆 Recent Achievements</h3>
              <div *ngIf="user?.achievements?.length === 0" class="text-center py-4">
                <p class="text-gray-500 dark:text-gray-400">No achievements yet</p>
              </div>
              <div class="space-y-3">
                <div *ngFor="let achievement of user?.achievements?.slice(0, 3)" 
                     class="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-up">
                  <div class="text-xl sm:text-2xl animate-bounce">🏆</div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{{ achievement.name }}</p>
                    <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{{ achievement.unlockedAt | date:'short' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Progress -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-lg">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">📊 Progress</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <span>Level Progress</span>
                    <span>{{ getLevelProgress() }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out animate-pulse" 
                         [style.width.%]="getLevelProgress()"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <!-- Create Habit Modal -->
      <div *ngIf="showCreateHabit" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-md animate-scale-in shadow-2xl">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Habit</h3>
          <form [formGroup]="habitForm" (ngSubmit)="createHabit()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input formControlName="name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea formControlName="description" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select formControlName="category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="health">Health</option>
                  <option value="fitness">Fitness</option>
                  <option value="learning">Learning</option>
                  <option value="productivity">Productivity</option>
                  <option value="mindfulness">Mindfulness</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select formControlName="difficulty" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="easy">Easy (8 XP)</option>
                  <option value="medium">Medium (10 XP)</option>
                  <option value="hard">Hard (15 XP)</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mt-6">
              <button type="submit" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-sm sm:text-base">Create Habit</button>
              <button type="button" (click)="showCreateHabit = false" class="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 sm:py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  habits: Habit[] = [];
  userRank: UserRank | null = null;
  showCreateHabit = false;
  loading = true;
  habitsLoading = false;
  habitForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    category: ['health', Validators.required],
    difficulty: ['medium', Validators.required],
    targetFrequency: [1]
  });

  constructor(
    private authService: AuthService,
    private habitService: HabitService,
    private leaderboardService: LeaderboardService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    Promise.all([
      this.loadHabits(),
      this.loadUserRank()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadHabits(): Promise<void> {
    return new Promise((resolve) => {
      this.habitService.getHabits().subscribe({
        next: (habits) => {
          this.habits = habits;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  loadUserRank(): Promise<void> {
    return new Promise((resolve) => {
      this.leaderboardService.getUserRank().subscribe({
        next: (rank) => {
          this.userRank = rank;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  createHabit(): void {
    if (this.habitForm.valid) {
      this.habitsLoading = true;
      this.habitService.createHabit(this.habitForm.value as any).subscribe(() => {
        this.loadHabits().then(() => {
          this.habitsLoading = false;
          this.showCreateHabit = false;
          this.habitForm.reset({ category: 'health', difficulty: 'medium', targetFrequency: 1 });
        });
      });
    }
  }

  completeHabit(habitId: string): void {
    this.habitService.completeHabit(habitId).subscribe(response => {
      this.loadHabits();
      // Update user XP and level
      if (this.user) {
        this.user.totalXP += response.xpEarned;
        this.user.level = response.newLevel;
      }
    });
  }

  deleteHabit(habitId: string): void {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habitService.deleteHabit(habitId).subscribe((response) => {
        this.loadHabits();
        this.loadUserRank();
        // Update user XP and level in real-time
        if (this.user && response.xpLost) {
          this.user.totalXP = Math.max(0, this.user.totalXP - response.xpLost);
          this.user.level = Math.floor(Math.sqrt(this.user.totalXP / 50)) + 1;
        }
      });
    }
  }

  isCompletedToday(habit: Habit): boolean {
    if (!habit.lastCompletedDate) return false;
    const today = new Date().toDateString();
    return new Date(habit.lastCompletedDate).toDateString() === today;
  }

  getLevelProgress(): number {
    if (!this.user) return 0;
    
    // Simple linear progression: 100 XP per level
    const currentLevelXP = (this.user.level - 1) * 100;
    const nextLevelXP = this.user.level * 100;
    const progress = ((this.user.totalXP - currentLevelXP) / 100) * 100;
    
    return Math.min(100, Math.max(0, Math.round(progress || 0)));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}