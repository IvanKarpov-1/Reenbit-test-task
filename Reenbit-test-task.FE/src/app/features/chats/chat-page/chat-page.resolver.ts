import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ChatsService } from '../chats.service';
import { Chat } from '../chat.model';
import { MessagesService } from '../../messages/services/messages.service';

export const chatPageResolver: ResolveFn<Chat | undefined> = (route, state) => {
  const chatsService = inject(ChatsService);
  const messagesService = inject(MessagesService);

  const chatId = route.paramMap.get('chatId') ?? '';

  messagesService.getMessages(chatId);
  return chatsService.getChat(chatId);
};
