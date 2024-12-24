import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.model';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly _chats = signal<Map<string, Chat>>(new Map<string, Chat>());
  chats = this._chats.asReadonly();
  private readonly _currentChat = signal<Chat | undefined>(undefined);
  currentChat = this._currentChat.asReadonly();

  getChats() {
    this.http
      .get<Chat[]>('api/chats')
      .subscribe((chats) =>
        chats.forEach((chat) => this.chats().set(chat._id, chat))
      );
  }

  getChat(chatId: string) {
    return (
      this.chats().has(chatId)
        ? of(this.chats().get(chatId))
        : this.http
            .get<Chat>(`api/chats/${chatId}`)
            .pipe(tap((chat) => this.chats().set(chat._id, chat)))
    ).pipe(tap((chat) => this._currentChat.set(chat)));
  }

  createChat(firstName: string, lastName: string) {
    return this.http
      .post<Chat>('api/chats', { firstName: firstName, lastName: lastName })
      .pipe(tap((chat) => this.chats().set(chat._id, chat)));
  }
}
