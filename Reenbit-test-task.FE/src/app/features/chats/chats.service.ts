import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.model';
import { of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly _chats = signal<Map<string, Chat>>(new Map<string, Chat>());
  chats = this._chats.asReadonly();
  private readonly _currentChat = signal<Chat | undefined>(undefined);
  currentChat = this._currentChat.asReadonly();
  private readonly router = inject(Router);

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

  updateChat(
    chatId: string,
    firstName?: string,
    lastName?: string,
    name?: string
  ) {
    return this.http
      .put<Chat>(
        `api/chats/${chatId}`,
        { firstName: firstName, lastName: lastName, name },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status === 200 && response.body) {
            this.chats().set(response.body._id, response.body);

            if (this._currentChat()?._id === response.body._id) {
              this._currentChat.set(response.body);
            }
          }
        })
      );
  }

  removeChat(chatId: string) {
    return this.http
      .delete(`api/chats/${chatId}`, { observe: 'response' })
      .pipe(
        tap((response) => {
          if (response.status === 204) {
            this.chats().delete(chatId);

            if (this._currentChat()?._id === chatId) {
              this.router.navigate(['/']);
            }
          }
        })
      );
  }
}
