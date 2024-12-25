import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { MessagesService } from '../messages.service';
import { UserService } from '../../user/user.service';
import { ChatsService } from '../../chats/chats.service';

@Component({
  selector: 'app-message-list',
  imports: [MessageComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
  host: {
    '(scroll)': 'onScroll()',
  },
})
export class MessageListComponent implements AfterViewInit {
  @ViewChildren('message') messageElements!: QueryList<any>;
  private readonly listElementRef = inject(ElementRef);
  private scrollContainer: any;
  private isNearBottom = true;
  private isInitialized = false;
  private readonly messagesService = inject(MessagesService);
  messages = this.messagesService.currentMessages;
  private readonly chatsService = inject(ChatsService);
  private currentChat = this.chatsService.currentChat;
  private readonly userService = inject(UserService);
  userId = this.userService.userId;

  constructor() {
    effect(() => {
      this.messages();
      setTimeout(() => {
        if (this.isInitialized) {
          this.onMessagesChanges();
        }
      });
    });

    effect(() => {
      this.currentChat();
      setTimeout(() => {
        if (this.isInitialized) {
          this.scrollToBottom();
        }
      });
    });
  }

  ngAfterViewInit() {
    this.scrollContainer = this.listElementRef.nativeElement;
    this.messageElements.changes.subscribe(() => this.onMessagesChanges());
    this.isInitialized = true;
    this.scrollToBottom();
  }

  onMessagesChanges() {
    setTimeout(() => {
      if (this.isNearBottom) {
        this.scrollToBottom('smooth');
      }
    });
  }

  scrollToBottom(behaviour: 'auto' | 'smooth' = 'auto') {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: behaviour,
    });
  }

  onScroll(): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }
}
