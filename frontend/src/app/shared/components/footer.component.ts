import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-center sm:text-left">
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              © {{ currentYear }} HabitTracker. Built with ❤️ for better habits.
            </p>
          </div>
          <div class="text-center sm:text-right">
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              Last updated: {{ currentDate | date:'MMM dd, yyyy' }}
            </p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  currentDate = new Date();
}