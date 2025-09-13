import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AdminPanelComponent } from './admin-panel.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AdminPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AdminPanelComponent }
    ])
  ]
})
export class AdminModule { }