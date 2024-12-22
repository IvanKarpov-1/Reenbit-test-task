import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  template: ` <button>Log Out</button> `,
  styleUrl: './logout-button.component.css',
  host: {
    '(click)': 'handleLogout()',
  },
})
export class LogoutButtonComponent {
  private auth = inject(AuthService);

  handleLogout() {
    this.auth.logout();
  }
}
