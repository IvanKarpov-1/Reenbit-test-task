import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { ChatsService } from '../chats/chats.service';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly chatsService = inject(ChatsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _userId = signal<string | undefined | null>(undefined);
  userId = this._userId.asReadonly();

  constructor(auth: AuthService) {
    auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this._userId.set(user?.sub));
  }

  login(user: User) {
    this.http
      .post('api/users/login', user)
      .subscribe((_) => this.chatsService.getChats());
  }
}
