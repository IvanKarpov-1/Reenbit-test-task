import { Component, inject } from '@angular/core';
import { LoginButtonComponent } from '../../../shared/components/buttons/login-button.component';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { LogoutButtonComponent } from '../../../shared/components/buttons/logout-button.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LoginButtonComponent, AsyncPipe, LogoutButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  isAuthenticated$ = this.auth.isAuthenticated$;
}
