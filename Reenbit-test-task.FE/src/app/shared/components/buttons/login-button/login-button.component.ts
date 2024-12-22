import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [],
  template: ` <button>Log In</button> `,
  styleUrl: './login-button.component.css',
  host: {
    '(click)': 'handleLogin()',
  },
})
export class LoginButtonComponent {
  private auth = inject(AuthService);

  handleLogin() {
    this.auth.loginWithRedirect();
  }
}
