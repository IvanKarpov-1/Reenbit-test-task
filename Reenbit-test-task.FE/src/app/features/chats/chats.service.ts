import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.model';
import { of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastsService } from '../../shared/components/toast/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly http = inject(HttpClient);
  private readonly _chats = signal<Map<string, Chat>>(new Map<string, Chat>());
  private readonly filteredChats = signal<Map<string, Chat>>(
    new Map<string, Chat>()
  );
  chats = this.filteredChats.asReadonly();
  private readonly _currentChat = signal<Chat | undefined>(undefined);
  currentChat = this._currentChat.asReadonly();
  private searchTerm: string | undefined;
  private readonly router = inject(Router);
  private readonly toastsService = inject(ToastsService);

  getChats() {
    this.http.get<Chat[]>('api/chats').subscribe((chats) =>
      chats.forEach((chat) => {
        this._chats().set(chat._id, chat);
        this.filteredChats().set(chat._id, chat);
      })
    );
  }

  getChat(chatId: string) {
    return (
      this._chats().has(chatId)
        ? of(this._chats().get(chatId))
        : this.http.get<Chat>(`api/chats/${chatId}`).pipe(
            tap((chat) => {
              this._chats().set(chat._id, chat);
              this.filteredChats().set(chat._id, chat);
            })
          )
    ).pipe(tap((chat) => this._currentChat.set(chat)));
  }

  createChat(firstName: string, lastName: string) {
    return this.http
      .post<Chat>('api/chats', { firstName: firstName, lastName: lastName })
      .pipe(
        tap((chat) => {
          this._chats().set(chat._id, chat);

          if (!this.searchTerm) {
            this.filteredChats().set(chat._id, chat);
          }
        })
      );
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
        { firstName: firstName, lastName: lastName, name: name },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          if (response.status === 200 && response.body) {
            this._chats().set(response.body._id, response.body);

            if (!this.searchTerm) {
              this.filteredChats().set(response.body._id, response.body);
            }

            if (this._currentChat()?._id === response.body._id) {
              this._currentChat.set(response.body);
            }
          } else {
            this.toastsService.showToast(
              'error',
              'An error occurred while updating the chat'
            );
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
            this._chats().delete(chatId);
            this.filteredChats().delete(chatId);

            if (this._currentChat()?._id === chatId) {
              this.router.navigate(['/']);
            }
          } else {
            this.toastsService.showToast(
              'error',
              'An error occurred while deleting the chat'
            );
          }
        })
      );
  }

  searchChat(searchTerm: string | undefined) {
    this.searchTerm = searchTerm;

    if (!searchTerm) {
      this.filteredChats.set(this._chats());
      return;
    }

    this.filteredChats().clear();

    searchTerm = searchTerm!.toLowerCase();

    this._chats().forEach((chat) => {
      if (
        chat.name?.toLowerCase().includes(searchTerm!) ||
        chat.virtualUser?.firstName.toLowerCase().includes(searchTerm!) ||
        chat.virtualUser?.lastName.toLowerCase().includes(searchTerm!)
      ) {
        console.log('Match');
        this.filteredChats().set(chat._id, chat);
      }
    });
  }
}
