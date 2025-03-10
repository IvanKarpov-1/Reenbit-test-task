import { Component } from '@angular/core';
import { SidebarHeaderComponent } from '../../../features/sidebar-header/sidebar-header.component';
import { ChatListComponent } from '../../../features/chats/chat-list/chat-list.component';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarHeaderComponent, ChatListComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {}
