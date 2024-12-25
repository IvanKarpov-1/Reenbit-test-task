import {
  AfterViewInit,
  Component,
  DestroyRef,
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
import { MessagesService } from '../../../messages/messages.service';

@Component({
  selector: 'app-chat-send-message',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './chat-send-message.component.html',
  styleUrl: './chat-send-message.component.css',
})
export class ChatSendMessageComponent implements OnInit, AfterViewInit {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  private readonly messagesService = inject(MessagesService);
  private readonly elementRef = viewChild.required<ElementRef>('messageArea');
  private readonly destroyRef = inject(DestroyRef);

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
    this.messagesService.createMessage(this.message.value!);
    this.messageForm.reset();
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
}
