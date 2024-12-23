import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { ChatsService } from '../chats/chats.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly chatsService = inject(ChatsService);

  login(user: User) {
    this.http
      .post('api/users/login', user)
      .subscribe((_) => this.chatsService.getChats());
  }
}
