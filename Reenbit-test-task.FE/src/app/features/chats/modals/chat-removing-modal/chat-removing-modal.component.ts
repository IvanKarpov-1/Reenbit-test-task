import { Component, inject, input } from '@angular/core';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { ChatsService } from '../../chats.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-removing-modal',
  imports: [FormsModule],
  templateUrl: './chat-removing-modal.component.html',
  styleUrl: './chat-removing-modal.component.css',
})
export class ChatRemovingModalComponent {
  chatId = input<string>();
  private readonly modalService = inject(ModalService);
  private readonly chatsService = inject(ChatsService);

  onCancel() {
    this.modalService.closeModal();
  }

  onSubmit() {
    this.chatsService
      .removeChat(this.chatId()!)
      .subscribe(() => this.modalService.closeModal());
  }
}
