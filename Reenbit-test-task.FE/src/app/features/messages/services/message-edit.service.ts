import { Injectable, signal } from '@angular/core';
import { Message } from '../message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageEditService {
  isEditing = signal<boolean>(false);
  message = signal<Message | undefined>(undefined);

  startEdit(message: Message) {
    this.isEditing.set(true);
    this.message.set(message);
  }

  endEdit() {
    this.isEditing.set(false);
    this.message.set(undefined);
  }
}
