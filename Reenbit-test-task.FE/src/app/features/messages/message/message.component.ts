import { Component, input, ViewEncapsulation } from '@angular/core';
import { ProfilePictureComponent } from '../../../shared/components/profile-picture/profile-picture.component';
import { DatePipe } from '@angular/common';
import { Message } from '../message.model';

@Component({
  selector: 'app-message',
  imports: [ProfilePictureComponent, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.own-message]': 'isOwn()',
    '[class.interlocutor-message]': '!isOwn()',
  },
})
export class MessageComponent {
  message = input.required<Message>();
  isOwn = input<boolean>(false);
}
