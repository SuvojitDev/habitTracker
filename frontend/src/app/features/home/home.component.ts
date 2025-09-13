import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <!-- Navbar -->
      <nav class="relative z-10 bg-transparent">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-white">🎯 HabitTracker</h1>
            </div>
            <div class="flex items-center space-x-4">
              <button (click)="navigate('/login')" class="text-white hover:text-gray-300 px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
              <button (click)="navigate('/register')" class="bg-white text-purple-900 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Build Better
              <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Habits
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
              Transform your life with gamified habit tracking. Earn XP, level up, and compete with friends.
            </p>
            <div class="flex justify-center animate-scale-in">
              <button (click)="navigate('/register')" 
                      class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose HabitTracker?</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300">Powerful features to keep you motivated</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 transform hover:scale-105 transition-all duration-300">
              <div class="text-6xl mb-4">🎮</div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gamification</h3>
              <p class="text-gray-600 dark:text-gray-300">Earn XP, unlock achievements, and level up as you build better habits.</p>
            </div>
            
            <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 transform hover:scale-105 transition-all duration-300">
              <div class="text-6xl mb-4">📊</div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h3>
              <p class="text-gray-600 dark:text-gray-300">Track your progress with detailed statistics and visual insights.</p>
            </div>
            
            <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 transform hover:scale-105 transition-all duration-300">
              <div class="text-6xl mb-4">🏆</div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Leaderboards</h3>
              <p class="text-gray-600 dark:text-gray-300">Compete with friends and climb the global leaderboard.</p>
            </div>
          </div>
        </div>
      </section>



      <!-- CTA Section -->
      <section class="py-20 bg-gray-900">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-4xl font-bold text-white mb-6">Ready to Transform Your Life?</h2>
          <p class="text-xl text-gray-300 mb-8">Join thousands of users who have already started their journey to better habits.</p>
          <button (click)="navigate('/register')" 
                  class="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-12 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}