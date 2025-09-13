import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  template: `
    <div *ngIf="isAdmin" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Admin Header -->
        <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">🔐 Admin Panel</h1>
          <a routerLink="/dashboard" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            ← Back
          </a>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <h3 class="text-sm sm:text-lg font-semibold mb-2">Total Users</h3>
            <p class="text-2xl sm:text-3xl font-bold animate-pulse">{{ stats?.userCount || 0 }}</p>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            <h3 class="text-sm sm:text-lg font-semibold mb-2">Active Habits</h3>
            <p class="text-2xl sm:text-3xl font-bold animate-bounce">{{ stats?.habitCount || 0 }}</p>
          </div>
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 class="text-lg font-semibold mb-2">Challenges</h3>
            <p class="text-3xl font-bold">12</p>
          </div>
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <h3 class="text-lg font-semibold mb-2">Achievements</h3>
            <p class="text-3xl font-bold">25</p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex flex-wrap gap-4 mb-6">
          <button
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            [ngClass]="{
              'bg-red-500 text-white': activeTab === tab.id,
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600': activeTab !== tab.id
            }"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Users Management -->
        <div *ngIf="activeTab === 'users'">
        <!-- Users Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Users</h2>
            <div class="flex space-x-4">
              <input
                [(ngModel)]="searchTerm"
                (input)="loadUsers()"
                placeholder="Search users..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
              <button
                (click)="clearAllData()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Clear All Data
              </button>
            </div>
          </div>

          <div *ngIf="loading" class="text-center py-8">
            <app-loader text="Loading users..."></app-loader>
          </div>

          <div *ngIf="!loading" class="overflow-x-auto">
            <cdk-virtual-scroll-viewport itemSize="80" class="h-96">
              <div class="min-w-full">
                <div class="bg-gray-50 dark:bg-gray-700 px-6 py-3 grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  <div>User</div>
                  <div>Level</div>
                  <div>XP</div>
                  <div>Actions</div>
                </div>
                <div *cdkVirtualFor="let user of users" class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 grid grid-cols-4 gap-4 items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </div>
                  <div class="text-sm text-gray-900 dark:text-white">{{ user.level }}</div>
                  <div>
                    <input
                      [(ngModel)]="user.totalXP"
                      (blur)="updateUserXP(user._id, user.totalXP)"
                      type="number"
                      class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                  </div>
                  <div class="text-sm">
                    <button
                      *ngIf="!user.isAdmin"
                      (click)="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      Delete
                    </button>
                    <span *ngIf="user.isAdmin" class="text-green-600 font-semibold">
                      🔐 Admin
                    </span>
                  </div>
                </div>
              </div>
            </cdk-virtual-scroll-viewport>

            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <div class="flex space-x-2">
                <button
                  (click)="changePage(currentPage - 1)"
                  [disabled]="currentPage === 1"
                  class="px-3 py-2 border rounded-lg disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Previous
                </button>
                <button
                  (click)="changePage(currentPage + 1)"
                  [disabled]="currentPage === totalPages"
                  class="px-3 py-2 border rounded-lg disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Habits Management -->
        <div *ngIf="activeTab === 'habits'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Habits Management</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button (click)="showHabitsModal = true; loadAllHabits()" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
              📊 View All Habits
            </button>
            <button (click)="deleteInactiveHabits()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
              🗑️ Delete Inactive
            </button>
            <button (click)="exportHabitsData()" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              📤 Export Data
            </button>
          </div>
        </div>

        <!-- Challenges Management -->
        <div *ngIf="activeTab === 'challenges'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Challenges Management</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button (click)="showChallengesModal = true" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
              ➕ Create Challenge
            </button>
            <button (click)="showChallengesModal = true" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              👁️ View Active
            </button>
            <button (click)="resetChallenges()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
              🔄 Reset All
            </button>
          </div>
        </div>

        <!-- Achievements Management -->
        <div *ngIf="activeTab === 'achievements'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements Management</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button (click)="showAchievementsModal = true" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
              🏆 Create Achievement
            </button>
            <button (click)="showAchievementsModal = true" class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold">
              💎 View All
            </button>
            <button (click)="resetAchievements()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
              🔄 Reset All
            </button>
          </div>
        </div>

        <!-- System Management -->
        <div *ngIf="activeTab === 'system'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">System Management</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button (click)="showSystemModal = true" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
              🗑️ Clear All Data
            </button>
            <button (click)="resetAllUserXP()" class="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
              🔄 Reset All XP
            </button>
            <button (click)="showSystemModal = true" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
              📊 System Tools
            </button>
          </div>
        </div>

        <!-- Analytics -->
        <div *ngIf="activeTab === 'analytics'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">System Analytics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">User Growth</h3>
              <p class="text-3xl font-bold text-blue-600">+{{ stats?.userCount || 0 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total registered users</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Active Habits</h3>
              <p class="text-3xl font-bold text-green-600">{{ stats?.habitCount || 0 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Currently active habits</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!isAdmin" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
        <p class="text-gray-600 dark:text-gray-300">Admin access required</p>
      </div>
    </div>

    <!-- Habits Modal -->
    <div *ngIf="showHabitsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">All Habits</h3>
          <button (click)="showHabitsModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
        </div>
        <div *ngIf="allHabits.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">No habits found</div>
        <div *ngIf="allHabits.length > 0" class="space-y-3">
          <div *ngFor="let habit of allHabits" class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ habit.name }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ habit.userId?.username }} - {{ habit.category }}</p>
            </div>
            <button (click)="deleteHabitAdmin(habit._id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Challenges Modal -->
    <div *ngIf="showChallengesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Challenges Management</h3>
          <button (click)="showChallengesModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
        </div>
        <div class="space-y-4">
          <button (click)="createDailyChallenge()" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">Create Daily Challenge</button>
          <div class="text-center py-4 text-gray-500 dark:text-gray-400">Daily challenges are auto-generated every 24 hours</div>
        </div>
      </div>
    </div>

    <!-- Achievements Modal -->
    <div *ngIf="showAchievementsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Achievements Management</h3>
          <button (click)="showAchievementsModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
        </div>
        <div class="space-y-4">
          <button (click)="createAchievement()" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">Create New Achievement</button>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 dark:text-white">🏆 First Habit</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Complete your first habit - 50 XP</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-900 dark:text-white">🔥 Week Warrior</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">7-day streak - 100 XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Modal -->
    <div *ngIf="showSystemModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">System Tools</h3>
          <button (click)="showSystemModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
        </div>
        <div class="space-y-4">
          <button (click)="clearAllData(); showSystemModal = false" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors">Clear All Data</button>
          <button (click)="viewSystemLogs()" class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">View System Logs</button>
        </div>
      </div>
    </div>
  `
})
export class AdminPanelComponent implements OnInit {
  isAdmin = false;
  users: any[] = [];
  stats: any = null;
  loading = false;
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  activeTab = 'users';
  allHabits: any[] = [];
  systemLogs: any[] = [];
  showHabitsModal = false;
  showChallengesModal = false;
  showAchievementsModal = false;
  showSystemModal = false;
  
  tabs = [
    { id: 'users', label: 'Users' },
    { id: 'habits', label: 'Habits' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'system', label: 'System' },
    { id: 'analytics', label: 'Analytics' }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log('Current user:', user); // Debug log
    this.isAdmin = user?.isAdmin === true;
    
    if (this.isAdmin) {
      this.loadStats();
      this.loadUsers();
    } else {
      console.log('User is not admin:', user?.isAdmin); // Debug log
    }
  }

  loadStats(): void {
    this.http.get('http://localhost:3000/api/admin/stats').subscribe(stats => {
      this.stats = stats;
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.http.get(`http://localhost:3000/api/admin/users?page=${this.currentPage}&search=${this.searchTerm}`)
      .subscribe((response: any) => {
        this.users = response.users;
        this.totalPages = response.pagination.pages;
        this.loading = false;
      });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  updateUserXP(userId: string, totalXP: number): void {
    this.http.put(`http://localhost:3000/api/admin/users/${userId}/xp`, { totalXP }).subscribe();
  }

  deleteUser(userId: string): void {
    if (confirm('Delete this user?')) {
      this.http.delete(`http://localhost:3000/api/admin/users/${userId}`).subscribe(() => {
        this.loadUsers();
        this.loadStats();
      });
    }
  }

  clearAllData(): void {
    if (confirm('⚠️ This will delete ALL user data. Continue?')) {
      this.http.delete('http://localhost:3000/api/admin/clear-all').subscribe(() => {
        this.loadUsers();
        this.loadStats();
      });
    }
  }

  loadAllHabits(): void {
    this.http.get<any>('http://localhost:3000/api/admin/habits').subscribe(response => {
      this.allHabits = response.habits || [];
    });
  }

  deleteHabitAdmin(habitId: string): void {
    if (confirm('Delete this habit?')) {
      this.http.delete(`http://localhost:3000/api/admin/habits/${habitId}`).subscribe(() => {
        this.loadAllHabits();
      });
    }
  }

  deleteInactiveHabits(): void {
    if (confirm('Delete all inactive habits?')) {
      this.http.delete('http://localhost:3000/api/admin/habits/inactive').subscribe(() => {
        this.loadAllHabits();
      });
    }
  }

  exportHabitsData(): void {
    this.http.get('http://localhost:3000/api/admin/export/habits')
      .subscribe(data => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'habits-export.json';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  exportAllData(): void {
    this.http.get('http://localhost:3000/api/admin/export/all', { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'system-export.json';
        a.click();
      });
  }

  resetAllUserXP(): void {
    if (confirm('Reset ALL users XP to 0?')) {
      this.http.post('http://localhost:3000/api/admin/reset-xp', {}).subscribe(() => {
        this.loadUsers();
        this.loadStats();
        alert('All user XP reset successfully!');
      });
    }
  }

  sendBulkNotification(): void {
    const message = prompt('Enter notification message:');
    if (message) {
      this.http.post('http://localhost:3000/api/admin/notify-all', { message }).subscribe(() => {
        alert('Notification sent to all users!');
      });
    }
  }

  toggleMaintenance(): void {
    this.http.post('http://localhost:3000/api/admin/maintenance', {}).subscribe(() => {
      alert('Maintenance mode toggled!');
    });
  }

  viewSystemLogs(): void {
    this.systemLogs = [
      { timestamp: new Date(), message: 'System started successfully' },
      { timestamp: new Date(Date.now() - 300000), message: 'Database indexes created' },
      { timestamp: new Date(Date.now() - 600000), message: 'User authentication successful' }
    ];
  }

  createDailyChallenge(): void {
    this.http.post('http://localhost:3000/api/admin/challenges/create', {}).subscribe(response => {
      alert('New daily challenge created!');
      this.showChallengesModal = false;
    });
  }

  resetChallenges(): void {
    if (confirm('Reset all challenges?')) {
      alert('Challenges reset functionality coming soon!');
    }
  }

  createAchievement(): void {
    const name = prompt('Achievement name:');
    const description = prompt('Achievement description:');
    if (name && description) {
      this.http.post('http://localhost:3000/api/admin/achievements/create', {
        name, description, xpReward: 50
      }).subscribe(() => {
        alert('Achievement created!');
        this.showAchievementsModal = false;
      });
    }
  }

  resetAchievements(): void {
    if (confirm('Reset all user achievements?')) {
      alert('Achievement reset functionality coming soon!');
    }
  }
}