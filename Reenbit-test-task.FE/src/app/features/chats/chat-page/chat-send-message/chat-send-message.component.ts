import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessagesService } from '../../../messages/services/messages.service';
import { MessageEditService } from '../../../messages/services/message-edit.service';

@Component({
  selector: 'app-chat-send-message',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './chat-send-message.component.html',
  styleUrl: './chat-send-message.component.css',
})
export class ChatSendMessageComponent implements OnInit, AfterViewInit {
  messageForm = new FormGroup({
    message: new FormControl<string | undefined>('', [Validators.required]),
  });
  private readonly messagesService = inject(MessagesService);
  private readonly elementRef = viewChild.required<ElementRef>('messageArea');
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageEditService = inject(MessageEditService);
  readonly isEditing = this.messageEditService.isEditing;
  private readonly messageToEdit = this.messageEditService.message;

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        this.message.setValue(this.messageToEdit()?.content);
      }
    });
  }

  get message() {
    return this.messageForm.controls.message;
  }

  ngOnInit() {
    this.messageForm.controls.message.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateState());
  }

  ngAfterViewInit() {
    this.resize();
  }

  onSend() {
    if (!this.isEditing()) {
      this.messagesService.createMessage(this.message.value!);
    } else {
      this.messagesService.updateMessage(
        this.messageToEdit()?._id!,
        this.message.value!
      );
      this.messageEditService.endEdit();
    }

    this.messageForm.reset();
  }

  onReset() {
    this.messageForm.reset();
    this.messageEditService.endEdit();
  }

  resize() {
    const nativeElement = this.elementRef().nativeElement;

    nativeElement.style.height = 'auto';

    const scrollHeight =
      nativeElement.scrollHeight !== 24 ? nativeElement.scrollHeight : 32;
    nativeElement.style.height = scrollHeight + 'px';

    const computedStyles = window.getComputedStyle(nativeElement);
    const maxHeight = computedStyles.getPropertyValue('max-height');
    const maxHeightValue = parseFloat(maxHeight);

    if (parseFloat(nativeElement.style.height) >= maxHeightValue) {
      nativeElement.style.overflowY = 'scroll';
      nativeElement.style.height = maxHeightValue;
    } else {
      nativeElement.style.overflow = 'hidden';
    }
  }

  updateState() {
    this.resize();
  }

  onEnter(event: Event) {
    event.preventDefault();
    if (this.message.value && this.message.value.length > 0) {
      this.onSend();
    }
  }

  onControlEnter(event: Event) {
    event.preventDefault();
    this.message.setValue(this.message.value + '\n');
  }
}
