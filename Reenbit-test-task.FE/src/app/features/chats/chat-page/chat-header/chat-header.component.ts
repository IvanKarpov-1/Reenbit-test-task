import { Component, inject } from '@angular/core';
import { ProfilePictureComponent } from '../../../../shared/components/profile-picture/profile-picture.component';
import { ChatActionsComponent } from '../../chat-actions/chat-actions.component';
import { ChatsService } from '../../chats.service';
import { ChatNamePipe } from '../../../../shared/pipes/chat-name.pipe';
import { ChatPicturePipe } from '../../../../shared/pipes/chat-picture.pipe';

@Component({
  selector: 'app-chat-header',
  imports: [
    ProfilePictureComponent,
    ChatActionsComponent,
    ChatNamePipe,
    ChatPicturePipe,
  ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {
  private readonly chatsService = inject(ChatsService);
  chat = this.chatsService.currentChat;
}
