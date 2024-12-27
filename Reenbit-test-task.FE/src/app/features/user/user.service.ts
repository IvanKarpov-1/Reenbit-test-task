import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserSettings } from './user.model';
import { ChatsService } from '../chats/chats.service';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = signal<User | null>(null);
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
      .post<User>('api/users/login', user, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200 || response.status === 201) {
          if (!response.body!.settings) {
            response.body!.settings = {
              isSendRandomAutomaticMessages: true,
            };
          }

          this.user.set(response.body);
          this.chatsService.getChats();
        }
      });
  }

  updateSettings<T extends UserSettings, K extends keyof T>(
    settingName: K,
    value: T[K]
  ) {
    this.http
      .put(
        'api/users/settings',
        {
          settingName: settingName,
          value: value,
        },
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (this.user() && response.status === 200) {
          const settings = this.user()!.settings as T;
          settings[settingName] = value;
        }
      });
  }
}
