import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoginButtonComponent } from '../../shared/components/buttons/login-button/login-button.component';
import { LogoutButtonComponent } from '../../shared/components/buttons/logout-button/logout-button.component';
import { AuthService } from '@auth0/auth0-angular';
import { ChatSearchComponent } from '../chats/chat-search/chat-search.component';
import { ProfilePictureComponent } from '../../shared/components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-sidebar-header',
  imports: [
    AsyncPipe,
    LoginButtonComponent,
    LogoutButtonComponent,
    ChatSearchComponent,
    ProfilePictureComponent,
  ],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.css',
})
export class SidebarHeaderComponent {
  private readonly auth = inject(AuthService);
  isAuthenticated$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
}
