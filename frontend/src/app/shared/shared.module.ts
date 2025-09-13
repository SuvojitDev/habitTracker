import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader.component';
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { FooterComponent } from './components/footer.component';

@NgModule({
  declarations: [
    LoaderComponent,
    ThemeToggleComponent,
    FooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    ThemeToggleComponent,
    FooterComponent
  ]
})
export class SharedModule { }