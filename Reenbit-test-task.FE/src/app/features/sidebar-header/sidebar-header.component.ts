import { Component, inject } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { LoginButtonComponent } from '../../shared/components/buttons/login-button/login-button.component';
import { LogoutButtonComponent } from '../../shared/components/buttons/logout-button/logout-button.component';
import { AuthService } from '@auth0/auth0-angular';
import { ChatSearchComponent } from '../chat-search/chat-search.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [
    AsyncPipe,
    LoginButtonComponent,
    LogoutButtonComponent,
    NgOptimizedImage,
    ChatSearchComponent,
  ],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.css',
})
export class SidebarHeaderComponent {
  private readonly auth = inject(AuthService);
  isAuthenticated$ = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
}
