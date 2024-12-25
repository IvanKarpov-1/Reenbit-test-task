import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValuesModifierService } from '../../core/services/values-modifier.service';
import { Message } from './message.model';
import { ChatsService } from '../chats/chats.service';
import { UserService } from '../user/user.service';
import { delay, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private readonly messages = signal<Map<string, Map<string, Message>>>(
    new Map<string, Map<string, Message>>()
  );
  private readonly http = inject(HttpClient);
  private readonly modifierService = inject(ValuesModifierService);
  private readonly chatsService = inject(ChatsService);
  private readonly currentChat = this.chatsService.currentChat;
  currentMessages = computed(() => {
    const chatId = this.currentChat()?._id ?? '';

    if (!this.messages().has(chatId)) {
      this.messages().set(chatId, new Map<string, Message>());
    }

    return this.messages().get(chatId)!;
  });
  private readonly userService = inject(UserService);
  private readonly userId = this.userService.userId;

  getMessages(chatId?: string) {
    chatId = chatId ?? this.currentChat()?._id;
    if (!chatId) return;

    this.http
      .get<Message[]>(`api/messages/chat/${chatId}`)
      .subscribe((messages) => {
        if (!this.messages().has(chatId)) {
          this.messages().set(chatId, new Map<string, Message>());
        }

        const chatsMessages = this.messages().get(chatId)!;

        messages.forEach((message) => chatsMessages.set(message._id, message));
      });
  }

  createMessage(content: string, chatId?: string) {
    chatId = chatId ?? this.currentChat()?._id;

    if (!chatId) return;

    const randomMessageId = this.getRandomId();

    const newMessage = {
      _id: randomMessageId,
      sender: { _id: this.userId()! },
      content: content,
      createdAt: Date.now().toString(),
      isAutoResponse: false,
    };

    const chat = this.chatsService.chats().get(chatId);

    let chatLastMessageChangeIndex: number | undefined;

    if (chat) {
      chatLastMessageChangeIndex = this.modifierService.update(
        chat,
        'lastMessage',
        // @ts-ignore
        { content: content }
      );
    }

    if (!this.messages().has(chatId)) {
      this.messages().set(chatId, new Map<string, Message>());
    }

    // @ts-ignore
    this.messages().get(chatId)?.set(newMessage._id, newMessage);

    this.http
      .post<Message>(
        `api/messages/chat/${chatId}`,
        { content: content },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status === 201) {
            const message = this.messages().get(chatId)!.get(randomMessageId)!;
            this.messages().get(chatId)!.delete(randomMessageId);

            message._id = response.body!._id;
            message.sender = response.body!.sender;
            message.isAutoResponse = response.body!.isAutoResponse;

            this.messages().get(chatId)!.set(message._id, message);
          } else {
            this.messages().get(chatId)?.delete(randomMessageId);
            if (chatLastMessageChangeIndex) {
              this.modifierService.restore(chatLastMessageChangeIndex);
            }
          }
        }),
        switchMap((response) => {
          if (response.status === 201) {
            return this.http.post<Message>(
              `api/messages/chat/${chatId}/auto-response`,
              {},
              { observe: 'response' }
            );
          } else {
            return of(undefined);
          }
        }),
        delay(3000)
      )
      .subscribe((response) => {
        if (response && response.status === 201) {
          this.messages().get(chatId)?.set(response.body!._id, response.body!);

          if (chat) {
            chat.lastMessage = response.body!;
          }
        }
      });
  }

  private getRandomId() {
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(10000);
    return Math.floor(
      Math.random() * (maxFloored - minCeiled) + minCeiled
    ).toString();
  }
}
