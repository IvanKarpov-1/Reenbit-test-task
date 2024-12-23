import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly _chats = signal<Chat[]>([]);
  chats = this._chats.asReadonly();

  getChats() {
    this.http
      .get<Chat[]>('api/chats')
      .subscribe((chats) => this._chats.set(chats));
  }
}
