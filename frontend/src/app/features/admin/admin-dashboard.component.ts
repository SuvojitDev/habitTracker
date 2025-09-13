import { Component, OnInit } from '@angular/core';
import { AdminService, DashboardStats, AdminUser, PaginatedResponse } from '../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">🔐 Admin Dashboard</h1>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ currentAdmin?.username }}</span>
              <button (click)="logout()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div *ngIf="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100">Total Users</p>
                <p class="text-3xl font-bold">{{ stats.stats.userCount }}</p>
              </div>
              <div class="text-4xl">👥</div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100">Active Habits</p>
                <p class="text-3xl font-bold">{{ stats.stats.habitCount }}</p>
              </div>
              <div class="text-4xl">🎯</div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100">Challenges</p>
                <p class="text-3xl font-bold">{{ stats.stats.challengeCount }}</p>
              </div>
              <div class="text-4xl">🏆</div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-100">Achievements</p>
                <p class="text-3xl font-bold">{{ stats.stats.achievementCount }}</p>
              </div>
              <div class="text-4xl">🏅</div>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex space-x-8 px-6">
              <button
                *ngFor="let tab of tabs"
                (click)="activeTab = tab.id"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                [ngClass]="{
                  'border-red-500 text-red-600': activeTab === tab.id,
                  'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300': activeTab !== tab.id
                }"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Users Management -->
        <div *ngIf="activeTab === 'users'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
            <div class="flex space-x-4">
              <input
                [(ngModel)]="searchTerm"
                (input)="searchUsers()"
                placeholder="Search users..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
              <button
                (click)="clearAllData()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear All Data
              </button>
            </div>
          </div>

          <div *ngIf="usersLoading" class="flex justify-center py-8">
            <app-loader text="Loading users..."></app-loader>
          </div>

          <div *ngIf="!usersLoading && users.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">XP</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr *ngFor="let user of users">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ user.level }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      [(ngModel)]="user.totalXP"
                      (blur)="updateUserXP(user._id, user.totalXP)"
                      type="number"
                      class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ user.createdAt | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} users
              </div>
              <div class="flex space-x-2">
                <button
                  (click)="changePage(currentPage - 1)"
                  [disabled]="currentPage === 1"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Previous
                </button>
                <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  (click)="changePage(currentPage + 1)"
                  [disabled]="currentPage === totalPages"
                  class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- System Analytics -->
        <div *ngIf="activeTab === 'analytics'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">System Analytics</h2>
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📊</div>
            <p class="text-gray-500 dark:text-gray-400">Analytics dashboard coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentAdmin: any = null;
  stats: DashboardStats | null = null;
  users: AdminUser[] = [];
  usersLoading = false;
  
  activeTab = 'users';
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;
  Math = Math;

  tabs = [
    { id: 'users', label: 'Users' },
    { id: 'habits', label: 'Habits' },
    { id: 'analytics', label: 'Analytics' }
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAdmin = this.adminService.currentAdmin$.subscribe(admin => {
      this.currentAdmin = admin;
      if (!admin) {
        this.router.navigate(['/admin/login']);
      }
    });

    this.loadDashboardStats();
    this.loadUsers();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.adminService.getUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.totalUsers = response.pagination.total;
        this.totalPages = response.pagination.pages;
        this.usersLoading = false;
      },
      error: () => {
        this.usersLoading = false;
      }
    });
  }

  searchUsers(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  updateUserXP(userId: string, totalXP: number): void {
    this.adminService.updateUserXP(userId, totalXP).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.loadUsers();
        this.loadDashboardStats();
      });
    }
  }

  clearAllData(): void {
    if (confirm('⚠️ WARNING: This will delete ALL user data, habits, and progress. This action cannot be undone. Are you absolutely sure?')) {
      this.adminService.clearAllData().subscribe(() => {
        this.loadUsers();
        this.loadDashboardStats();
        alert('All data has been cleared successfully.');
      });
    }
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
}