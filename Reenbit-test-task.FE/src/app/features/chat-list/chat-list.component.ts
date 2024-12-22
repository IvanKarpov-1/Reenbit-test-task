import { Component } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [ChatItemComponent],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {}
