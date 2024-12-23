import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatsService } from '../chats.service';
import { ModalService } from '../../../shared/components/modal/modal.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-creation-modal',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './chat-creation-modal.component.html',
  styleUrl: './chat-creation-modal.component.css',
})
export class ChatCreationModalComponent {
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
  private readonly chatsService = inject(ChatsService);
  private readonly modalService = inject(ModalService);

  get firstName() {
    return this.form.controls.firstName;
  }

  get lastName() {
    return this.form.controls.lastName;
  }

  onCancel() {
    this.modalService.closeModal();
  }

  onSubmit() {
    this.chatsService
      .createChat(this.firstName.value!, this.lastName.value!)
      .subscribe(() => this.modalService.closeModal());
  }
}
