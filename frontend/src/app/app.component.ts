import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class AppComponent {
  title = 'habit-tracker';
}