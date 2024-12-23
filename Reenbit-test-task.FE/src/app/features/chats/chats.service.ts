import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.model';
import { tap } from 'rxjs';

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

  createChat(firstName: string, lastName: string) {
    return this.http
      .post<Chat>('api/chats', { firstName: firstName, lastName: lastName })
      .pipe(tap((chat) => this._chats.update((chats) => [...chats, chat])));
  }
}
