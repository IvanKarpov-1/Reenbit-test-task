import { Component, inject } from '@angular/core';
import { ModalService } from './modal.service';
import { NgClass } from '@angular/common';
import { ChatCreationModalComponent } from '../../../features/chats/modals/chat-creation-modal/chat-creation-modal.component';
import { ChatRemovingModalComponent } from '../../../features/chats/modals/chat-removing-modal/chat-removing-modal.component';
import { ChatUpdationModalComponent } from '../../../features/chats/modals/chat-updation-modal/chat-updation-modal.component';

@Component({
  selector: 'app-modal',
  imports: [
    NgClass,
    ChatCreationModalComponent,
    ChatRemovingModalComponent,
    ChatUpdationModalComponent,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  modalService = inject(ModalService);
  currentModal = this.modalService.currentModal;
  callback = this.modalService.callback;
  params = this.modalService.params;

  onCloseModal() {
    this.modalService.closeModal();
  }
}
