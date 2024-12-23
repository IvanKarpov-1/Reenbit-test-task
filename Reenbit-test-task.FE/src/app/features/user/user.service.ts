import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  login(user: User) {
    this.http.post('api/users/login', user).subscribe();
  }
}
