import { Component, input, signal, ViewEncapsulation } from '@angular/core';
import { ProfilePictureComponent } from '../../../shared/components/profile-picture/profile-picture.component';
import { DatePipe } from '@angular/common';
import { Message } from '../message.model';
import { MessageActionsComponent } from '../message-actions/message-actions.component';

@Component({
  selector: 'app-message',
  imports: [ProfilePictureComponent, DatePipe, MessageActionsComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.own-message]': 'isOwn()',
    '[class.interlocutor-message]': '!isOwn()',
    '(mouseover)': 'onMouseover()',
    '(mouseleave)': 'onMouseleave()',
  },
})
export class MessageComponent {
  message = input.required<Message>();
  isOwn = input<boolean>(false);
  outerHoveringState = signal<boolean>(false);

  onMouseover() {
    this.outerHoveringState.set(true);
  }

  onMouseleave() {
    this.outerHoveringState.set(false);
  }
}
