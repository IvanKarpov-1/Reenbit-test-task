import { Component } from '@angular/core';
import { ProfilePictureComponent } from '../../shared/components/profile-picture/profile-picture.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [ProfilePictureComponent, RouterLink],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent {}
