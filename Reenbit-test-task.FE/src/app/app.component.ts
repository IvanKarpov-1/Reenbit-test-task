import { Component, signal } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { DividerComponent } from './core/layout/divider/divider.component';
import { MainContentComponent } from './core/layout/main-content/main-content.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, DividerComponent, MainContentComponent, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  sidebarWidth = signal<number>(400);

  onResizeSidebar(width: number) {
    this.sidebarWidth.set(width);
  }
}
