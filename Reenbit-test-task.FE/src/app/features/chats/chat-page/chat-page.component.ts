import { Component, input } from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ChatContentComponent } from './chat-content/chat-content.component';
import { ChatFooterComponent } from './chat-footer/chat-footer.component';
import { Chat } from '../chat.model';

@Component({
  selector: 'app-chat-page',
  imports: [ChatHeaderComponent, ChatContentComponent, ChatFooterComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {
  chat = input<Chat | undefined>();
}
