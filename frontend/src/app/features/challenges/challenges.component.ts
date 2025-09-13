import { Component, OnInit } from '@angular/core';
import { ChallengeService, Challenge } from '../../core/services/challenge.service';

@Component({
  selector: 'app-challenges',
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">🎯 Daily Challenges</h1>
          <p class="text-gray-600">Complete challenges for bonus XP and rewards!</p>
        </div>

        <div *ngIf="loading" class="flex justify-center py-12">
          <app-loader text="Loading challenges..."></app-loader>
        </div>

        <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let challenge of challenges" 
               class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-green-500">
            
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ challenge.title }}</h3>
                <p class="text-gray-600 text-sm mb-3">{{ challenge.description }}</p>
                
                <div class="flex items-center space-x-4 text-sm">
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {{ challenge.type | titlecase }}
                  </span>
                  <span class="text-orange-600 font-semibold">+{{ challenge.xpReward }} XP</span>
                </div>
              </div>
              
              <div class="text-2xl">🎯</div>
            </div>

            <div class="mb-4">
              <div class="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Participants</span>
                <span>{{ challenge.participants.length }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                     [style.width.%]="Math.min(100, challenge.participants.length)"></div>
              </div>
            </div>

            <button 
              (click)="joinChallenge(challenge._id)"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Join Challenge
            </button>
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
export class ChallengesComponent implements OnInit {
  challenges: Challenge[] = [];
  loading = true;
  Math = Math;

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  joinChallenge(challengeId: string): void {
    this.challengeService.joinChallenge(challengeId).subscribe(() => {
      this.loadChallenges();
    });
  }
}