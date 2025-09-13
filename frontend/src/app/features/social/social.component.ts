import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialService, Friend, FriendRequest } from '../../core/services/social.service';

@Component({
  selector: 'app-social',
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">👥 Social Hub</h1>
          <p class="text-gray-600">Connect with friends and join habit groups!</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Friends Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Friends</h2>
            
            <!-- Add Friend Form -->
            <form [formGroup]="friendForm" (ngSubmit)="sendFriendRequest()" class="mb-6">
              <div class="flex space-x-2">
                <input
                  formControlName="username"
                  placeholder="Enter username"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                <button
                  type="submit"
                  [disabled]="friendForm.invalid"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Add Friend
                </button>
              </div>
            </form>

            <!-- Friend Requests -->
            <div *ngIf="pendingRequests.length > 0" class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Friend Requests</h3>
              <div class="space-y-2">
                <div *ngFor="let request of pendingRequests" 
                     class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span class="font-medium">{{ request.from.username }}</span>
                  <div class="flex space-x-2">
                    <button
                      (click)="respondToRequest(request._id, 'accept')"
                      class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      (click)="respondToRequest(request._id, 'reject')"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Friends List -->
            <div class="space-y-3">
              <div *ngFor="let friend of friends" 
                   class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ friend.username.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ friend.username }}</p>
                    <p class="text-sm text-gray-500">Level {{ friend.level }} • {{ friend.totalXP }} XP</p>
                  </div>
                </div>
                <div class="text-2xl">👋</div>
              </div>
            </div>

            <div *ngIf="friends.length === 0" class="text-center py-8">
              <div class="text-4xl mb-2">👥</div>
              <p class="text-gray-500">No friends yet. Add some friends to get started!</p>
            </div>
          </div>

          <!-- Groups Section -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Habit Groups</h2>
            
            <!-- Create/Join Group Forms -->
            <div class="space-y-4 mb-6">
              <form [formGroup]="groupForm" (ngSubmit)="createGroup()" class="space-y-3">
                <input
                  formControlName="name"
                  placeholder="Group name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                <textarea
                  formControlName="description"
                  placeholder="Group description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  [disabled]="groupForm.invalid"
                  class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Create Group
                </button>
              </form>

              <div class="border-t pt-4">
                <form [formGroup]="joinForm" (ngSubmit)="joinGroup()" class="flex space-x-2">
                  <input
                    formControlName="inviteCode"
                    placeholder="Enter invite code"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                  <button
                    type="submit"
                    [disabled]="joinForm.invalid"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>

            <div class="text-center py-8">
              <div class="text-4xl mb-2">👥</div>
              <p class="text-gray-500">Create or join groups to collaborate on habits!</p>
            </div>
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
export class SocialComponent implements OnInit {
  friends: Friend[] = [];
  pendingRequests: FriendRequest[] = [];
  
  friendForm: FormGroup;
  groupForm: FormGroup;
  joinForm: FormGroup;

  constructor(
    private socialService: SocialService,
    private fb: FormBuilder
  ) {
    this.friendForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.joinForm = this.fb.group({
      inviteCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFriends();
  }

  loadFriends(): void {
    this.socialService.getFriends().subscribe(data => {
      this.friends = data.friends;
      this.pendingRequests = data.pendingRequests;
    });
  }

  sendFriendRequest(): void {
    if (this.friendForm.valid) {
      const username = this.friendForm.get('username')?.value;
      this.socialService.sendFriendRequest(username).subscribe(() => {
        this.friendForm.reset();
        this.loadFriends();
      });
    }
  }

  respondToRequest(requestId: string, action: 'accept' | 'reject'): void {
    this.socialService.respondToFriendRequest(requestId, action).subscribe(() => {
      this.loadFriends();
    });
  }

  createGroup(): void {
    if (this.groupForm.valid) {
      const { name, description } = this.groupForm.value;
      this.socialService.createHabitGroup(name, description, false).subscribe(() => {
        this.groupForm.reset();
      });
    }
  }

  joinGroup(): void {
    if (this.joinForm.valid) {
      const inviteCode = this.joinForm.get('inviteCode')?.value;
      this.socialService.joinHabitGroup(inviteCode).subscribe(() => {
        this.joinForm.reset();
      });
    }
  }
}