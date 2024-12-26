import { Component, inject, input } from '@angular/core';
import { Message } from '../message.model';
import { MessagesService } from '../services/messages.service';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { MessageEditService } from '../services/message-edit.service';

@Component({
  selector: 'app-message-actions',
  imports: [DropdownComponent],
  templateUrl: './message-actions.component.html',
  styleUrl: './message-actions.component.css',
})
export class MessageActionsComponent {
  message = input.required<Message>();
  isShowActivatorButtonOnOuterHover = input<boolean>(false);
  outerHoveringState = input<boolean>(false);
  private readonly messagesService = inject(MessagesService);
  private readonly messageEditService = inject(MessageEditService);

  onEdit() {
    this.messageEditService.startEdit(this.message());
  }

  onRemove() {
    this.messagesService.removeMessage(this.message()._id);
  }
}
