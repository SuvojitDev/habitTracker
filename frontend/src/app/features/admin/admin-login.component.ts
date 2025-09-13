import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔐 Admin Portal</h1>
          <p class="text-gray-600 dark:text-gray-300">Secure administrative access</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Admin email"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Admin password"
            >
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-purple-700 disabled:opacity-50 transition-all transform hover:scale-105"
          >
            {{ loading ? 'Authenticating...' : 'Admin Login' }}
          </button>

          <div *ngIf="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {{ error }}
          </div>
        </form>

        <div class="mt-6 text-center">
          <a routerLink="/login" class="text-red-600 hover:text-red-700 font-semibold">← Back to User Login</a>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.adminService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.adminService.setCurrentAdmin(response);
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed';
          this.loading = false;
        }
      });
    }
  }
}