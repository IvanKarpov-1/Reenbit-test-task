import { Component, inject } from '@angular/core';
import { ModalService } from './modal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
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
