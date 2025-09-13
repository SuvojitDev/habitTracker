import { Component, OnInit } from '@angular/core';
import { LeaderboardService, LeaderboardEntry, UserRank } from '../../core/services/leaderboard.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-leaderboard',
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
          <p class="text-gray-600">See how you rank against other habit builders!</p>
        </div>

        <!-- User Rank Card -->
        <div *ngIf="userRank" class="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white mb-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">Your Rank</h2>
            <div class="flex items-center justify-center space-x-8">
              <div class="text-center">
                <p class="text-3xl font-bold">#{{ userRank.rank }}</p>
                <p class="text-purple-100">Position</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold">{{ userRank.totalXP | number }}</p>
                <p class="text-purple-100">Total XP</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold">{{ userRank.percentile }}%</p>
                <p class="text-purple-100">Percentile</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Top Players</h3>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div *ngFor="let entry of leaderboard; let i = index" 
                 class="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                         [ngClass]="{
                           'bg-yellow-500': entry.rank === 1,
                           'bg-gray-400': entry.rank === 2,
                           'bg-orange-500': entry.rank === 3,
                           'bg-blue-500': entry.rank > 3
                         }">
                      {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank }}
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ entry.username }}</p>
                    <p class="text-sm text-gray-500">Level {{ entry.level }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <p class="font-bold text-gray-900">{{ entry.totalXP | number }} XP</p>
                    <p class="text-sm text-gray-500">Rank #{{ entry.rank }}</p>
                  </div>
                  <button 
                    *ngIf="currentUser?.isAdmin"
                    (click)="resetUserXP(entry.userId)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Reset XP
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="leaderboard.length === 0" class="px-6 py-12 text-center">
            <div class="text-6xl mb-4">🏆</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No rankings yet</h3>
            <p class="text-gray-600">Be the first to complete habits and claim the top spot!</p>
          </div>
        </div>

        <div class="text-center mt-8">
          <a routerLink="/dashboard" 
             class="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  userRank: UserRank | null = null;
  currentUser: any = null;

  constructor(
    private leaderboardService: LeaderboardService,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaderboard();
    this.loadUserRank();
  }

  loadLeaderboard(): void {
    this.leaderboardService.getLeaderboard().subscribe(data => {
      this.leaderboard = data;
    });
  }

  loadUserRank(): void {
    this.leaderboardService.getUserRank().subscribe(rank => {
      this.userRank = rank;
    });
  }

  resetUserXP(userId: string): void {
    if (confirm('Reset this user\'s XP to 0?')) {
      this.adminService.updateUserXP(userId, 0)
        .subscribe(() => {
          this.loadLeaderboard();
          this.loadUserRank();
        });
    }
  }
}