import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValuesModifierService } from '../../../core/services/values-modifier.service';
import { Message } from '../message.model';
import { ChatsService } from '../../chats/chats.service';
import { UserService } from '../../user/user.service';
import { delay, of, switchMap, tap } from 'rxjs';
import { ToastsService } from '../../../shared/components/toast/toasts.service';
import { CustomSocketService } from '../../../core/services/custom-socket.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private readonly userService = inject(UserService);
  private readonly userId = this.userService.userId;
  private readonly chatsService = inject(ChatsService);
  private readonly currentChat = this.chatsService.currentChat;
  private readonly messages = signal<Map<string, Map<string, Message>>>(
    new Map<string, Map<string, Message>>()
  );
  private readonly _isMessagesLoading = signal<boolean>(false);
  currentMessages = computed(() => {
    const chatId = this.currentChat()?._id ?? '';
    this._isMessagesLoading();

    // if (!this.messages().has(chatId)) {
    //   this.messages().set(chatId, new Map<string, Message>());
    // }

    return this.messages().get(chatId);
  });
  private readonly messagesFlatten: Map<
    string,
    { chatId: string; message: Message }
  > = new Map<string, { chatId: string; message: Message }>();
  private readonly http = inject(HttpClient);
  private readonly modifierService = inject(ValuesModifierService);
  private readonly toastsService = inject(ToastsService);
  private readonly io = inject(CustomSocketService);

  constructor() {
    this.io.on('receiveMessage', (message: Message) => {
      this.onReceiveMessage(message);
    });
  }

  getMessages(chatId?: string) {
    chatId = chatId ?? this.currentChat()?._id;
    if (!chatId) return;

    this._isMessagesLoading.set(true);

    this.http
      .get<Message[]>(`api/messages/chat/${chatId}`)
      .subscribe((messages) => {
        // if (!this.messages().has(chatId)) {
        //   this.messages().set(chatId, new Map<string, Message>());
        // }

        this.messages().set(chatId, new Map<string, Message>());

        const chatsMessages = this.messages().get(chatId)!;

        messages.forEach((message) => {
          message.internalId = message._id;
          chatsMessages.set(message.internalId, message);
          this.messagesFlatten.set(message.internalId, { chatId, message });
        });

        this._isMessagesLoading.set(false);
      });
  }

  createMessage(content: string, chatId?: string) {
    chatId = chatId ?? this.currentChat()?._id;

    if (!chatId) return;

    const randomMessageId = this.getRandomId();

    const newMessage = {
      internalId: randomMessageId,
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

      this.chatsService.sortChats();
    }

    if (!this.messages().has(chatId)) {
      this.messages().set(chatId, new Map<string, Message>());
    }

    // @ts-ignore
    this.messages().get(chatId)?.set(newMessage.internalId, newMessage);
    // @ts-ignore
    this.messagesFlatten.set(newMessage.internalId, newMessage);

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

            message._id = response.body!._id;
            message.sender = response.body!.sender;
            message.isAutoResponse = response.body!.isAutoResponse;
          } else {
            this.messages().get(chatId)?.delete(randomMessageId);
            this.messagesFlatten.delete(randomMessageId);

            if (chatLastMessageChangeIndex) {
              this.modifierService.restore(chatLastMessageChangeIndex);
            }

            this.chatsService.sortChats();

            this.toastsService.showToast(
              'error',
              'An error occurred while creating the message'
            );
          }
        }),
        delay(3000),
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
        })
      )
      .subscribe((response) => {
        if (response && response.status === 201) {
          const autoResponse = response.body!;
          autoResponse.internalId = autoResponse._id;

          this.messages()
            .get(chatId)
            ?.set(autoResponse.internalId, autoResponse);
          this.messagesFlatten.set(autoResponse.internalId, {
            chatId,
            message: autoResponse,
          });

          if (chat) {
            chat.lastMessage = autoResponse;
          }

          this.chatsService.sortChats();

          this.toastsService.showToast(
            'new-message',
            autoResponse.content,
            10000,
            autoResponse.senderPicture,
            `${autoResponse.sender.firstName} ${autoResponse.sender.lastName}`,
            chatId
          );
        }
      });
  }

  updateMessage(messageId: string, content: string) {
    if (!this.messagesFlatten.has(messageId)) {
      return;
    }

    const message = this.messagesFlatten.get(messageId)!.message;

    const messageContentChangeIndex = this.modifierService.update(
      message,
      'content',
      content
    );
    const messageUpdatedAtChangeIndex = this.modifierService.update(
      message,
      'updatedAt',
      Date.now().toString()
    );

    this.http
      .put(
        `api/messages/${messageId}`,
        { content: content },
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.status !== 200) {
          this.modifierService.restore(messageUpdatedAtChangeIndex);
          this.modifierService.restore(messageContentChangeIndex);
          this.toastsService.showToast(
            'error',
            'An error occurred while updating the message'
          );
        }
      });
  }

  removeMessage(messageId: string) {
    return this.http
      .delete(`api/messages/${messageId}`, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 204) {
          const chatId = this.messagesFlatten.get(messageId)?.chatId;

          if (chatId) {
            this.messages().get(chatId)?.delete(messageId);
          }

          this.messagesFlatten.delete(messageId);
        } else {
          this.toastsService.showToast(
            'error',
            'An error occurred while removing the chat'
          );
        }
      });
  }

  private onReceiveMessage(message: Message) {
    message.internalId = message._id;
    const chatId = message.chat._id;
    const chat = this.chatsService.chats().get(chatId);

    this.messages().get(chatId)?.set(message.internalId, message);
    this.messagesFlatten.set(message.internalId, {
      chatId,
      message: message,
    });

    if (chat) {
      chat.lastMessage = message;
    }

    this.chatsService.sortChats();

    this.toastsService.showToast(
      'new-message',
      message.content,
      10000,
      message.senderPicture,
      `${message.sender.firstName} ${message.sender.lastName}`,
      chatId
    );
  }

  private getRandomId() {
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(10000);
    return Math.floor(
      Math.random() * (maxFloored - minCeiled) + minCeiled
    ).toString();
  }
}
