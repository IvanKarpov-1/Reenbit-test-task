import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomSocketService extends Socket {
  constructor(private auth: AuthService) {
    const socketIoConfig: SocketIoConfig = {
      url: environment.apiBaseUrl,
      options: {
        autoConnect: false,
      },
    };

    super(socketIoConfig);

    auth.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        switchMap(() => auth.getAccessTokenSilently()),
        tap(
          (token) =>
            (this.ioSocket.auth = {
              ...this.ioSocket.auth,
              token: `Bearer ${token}`,
            })
        ),
        switchMap(() => auth.user$)
      )
      .subscribe((user) => {
        this.ioSocket.auth = { ...this.ioSocket.auth, userId: user?.sub };
      });
  }
}
