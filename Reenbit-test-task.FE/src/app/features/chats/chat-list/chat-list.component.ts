import { Component, inject, OnInit } from '@angular/core';
import { ChatItemComponent } from '../chat-item/chat-item.component';
import { ChatsService } from '../chats.service';

@Component({
  selector: 'app-chat-list',
  imports: [ChatItemComponent],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent implements OnInit {
  private readonly chatsService = inject(ChatsService);
  chats = this.chatsService.chats;

  ngOnInit() {
    this.chatsService.getChats();
  }
}
