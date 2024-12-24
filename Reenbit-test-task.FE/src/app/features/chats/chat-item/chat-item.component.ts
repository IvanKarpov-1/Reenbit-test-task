import { Component, input } from '@angular/core';
import { ProfilePictureComponent } from '../../../shared/components/profile-picture/profile-picture.component';
import { RouterLink } from '@angular/router';
import { Chat } from '../chat.model';
import { RecencyDatePipe } from '../../../shared/pipes/recency-date.pipe';
import { ChatPicturePipe } from '../../../shared/pipes/chat-picture.pipe';
import { ChatNamePipe } from '../../../shared/pipes/chat-name.pipe';

@Component({
  selector: 'app-chat-item',
  imports: [
    ProfilePictureComponent,
    RouterLink,
    RecencyDatePipe,
    ChatPicturePipe,
    ChatNamePipe,
  ],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent {
  chat = input.required<Chat>();
}
