import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ChatsService } from '../chats.service';
import { Chat } from '../chat.model';

export const chatPageResolver: ResolveFn<Chat | undefined> = (route, state) => {
  const chatsService = inject(ChatsService);
  return chatsService.getChat(route.paramMap.get('chatId') ?? '');
};
