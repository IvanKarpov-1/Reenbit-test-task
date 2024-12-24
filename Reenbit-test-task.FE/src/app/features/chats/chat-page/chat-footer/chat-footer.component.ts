import { Component } from '@angular/core';
import { ChatSendMessageComponent } from '../chat-send-message/chat-send-message.component';

@Component({
  selector: 'app-chat-footer',
  imports: [ChatSendMessageComponent],
  templateUrl: './chat-footer.component.html',
  styleUrl: './chat-footer.component.css',
})
export class ChatFooterComponent {}
