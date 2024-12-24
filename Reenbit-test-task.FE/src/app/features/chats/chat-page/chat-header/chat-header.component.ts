import { Component } from '@angular/core';
import { ProfilePictureComponent } from '../../../../shared/components/profile-picture/profile-picture.component';
import { ChatActionsComponent } from '../../chat-actions/chat-actions.component';

@Component({
  selector: 'app-chat-header',
  imports: [ProfilePictureComponent, ChatActionsComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css',
})
export class ChatHeaderComponent {}
