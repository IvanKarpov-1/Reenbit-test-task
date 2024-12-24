import { Component, inject, input } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { ModalService } from '../../../shared/components/modal/modal.service';
import { Chat } from '../chat.model';

@Component({
  selector: 'app-chat-actions',
  imports: [DropdownComponent],
  templateUrl: './chat-actions.component.html',
  styleUrl: './chat-actions.component.css',
})
export class ChatActionsComponent {
  chat = input<Chat>();
  private readonly modalService = inject(ModalService);

  onEdit() {
    this.modalService.openModal('updateChat', undefined, this.chat());
  }

  onRemove() {
    this.modalService.openModal('removeChat', undefined, this.chat()?._id);
  }
}
