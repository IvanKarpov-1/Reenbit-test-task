import { Component, inject } from '@angular/core';
import { ModalService } from './modal.service';
import { NgClass } from '@angular/common';
import { ChatCreationModalComponent } from '../../../features/chats/chat-creation-modal/chat-creation-modal.component';

@Component({
  selector: 'app-modal',
  imports: [NgClass, ChatCreationModalComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  modalService = inject(ModalService);
  currentModal = this.modalService.currentModal;

  onCloseModal() {
    this.modalService.closeModal();
  }
}
