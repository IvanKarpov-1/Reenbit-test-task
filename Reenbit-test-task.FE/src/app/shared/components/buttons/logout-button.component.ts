import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  template: ` <button class="" (click)="handleLogout()">Log Out</button> `,
})
export class LogoutButtonComponent {
  private auth = inject(AuthService);

  handleLogout() {
    this.auth.logout();
  }
}
