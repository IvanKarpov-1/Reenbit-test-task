import { Component, computed, inject, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatsService } from '../../chats.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { NgClass } from '@angular/common';
import { Chat } from '../../chat.model';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-chat-updation-modal',
  imports: [FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './chat-updation-modal.component.html',
  styleUrl: './chat-updation-modal.component.css',
})
export class ChatUpdationModalComponent {
  chat = input<Chat | undefined>();
  form = computed(() => {
    const chat = this.chat();
    if (!chat) {
      return new FormGroup(
        {} as {
          [key: string]: FormControl<string>;
        }
      );
    }

    switch (chat.chatType) {
      case 'AutoResponse':
        return new FormGroup({
          firstName: new FormControl(chat.virtualUser.firstName || '', [
            Validators.required,
          ]),
          lastName: new FormControl(chat.virtualUser.lastName || '', [
            Validators.required,
          ]),
        } as {
          [key: string]: FormControl<string>;
        });
      case 'Group':
        return new FormGroup({
          name: new FormControl(chat.name || '', [Validators.required]),
        } as {
          [key: string]: FormControl<string>;
        });
      default:
        return new FormGroup(
          {} as {
            [key: string]: FormControl<string>;
          }
        );
    }
  });
  private readonly userService = inject(UserService);
  private readonly userId = this.userService.userId;
  private readonly chatsService = inject(ChatsService);
  private readonly modalService = inject(ModalService);

  get firstName() {
    return this.form().get('firstName') as FormControl<string>;
  }

  get lastName() {
    return this.form().get('lastName') as FormControl<string>;
  }

  get name() {
    return this.form().get('name') as FormControl<string>;
  }

  onCancel() {
    this.modalService.closeModal();
  }

  onSubmit() {
    this.chatsService
      .updateChat(
        this.chat()?._id!,
        this.firstName?.value,
        this.lastName?.value,
        this.name?.value
      )
      .subscribe(() => this.modalService.closeModal());
  }
}
