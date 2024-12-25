import { Component, input } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatFooterComponent } from './chat-footer/chat-footer.component';
import { Chat } from '../chat.model';
import { MessageListComponent } from '../../messages/message-list/message-list.component';

@Component({
  selector: 'app-chat-page',
  imports: [ChatHeaderComponent, ChatFooterComponent, MessageListComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  chat = input<Chat | undefined>();
}
