import { Component } from '@angular/core';
import { SidebarHeaderComponent } from '../../../features/sidebar-header/sidebar-header.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarHeaderComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {}
