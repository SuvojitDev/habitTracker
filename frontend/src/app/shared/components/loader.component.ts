import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClass">
      <div class="relative">
        <div class="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
        <div class="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-blue-500 animate-spin animation-delay-150"></div>
      </div>
      <span *ngIf="text" class="ml-3 text-gray-600 font-medium">{{ text }}</span>
    </div>
  `,
  styles: [`
    .animation-delay-150 {
      animation-delay: 150ms;
    }
  `]
})
export class LoaderComponent {
  @Input() text = '';
  @Input() containerClass = 'py-8';
}