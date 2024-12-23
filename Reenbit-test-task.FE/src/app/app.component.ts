import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { DividerComponent } from './core/layout/divider/divider.component';
import { MainContentComponent } from './core/layout/main-content/main-content.component';
import { NgStyle } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './features/user/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from './features/user/user.model';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, DividerComponent, MainContentComponent, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  sidebarWidth = signal<number>(400);
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.auth.user$
      .pipe(
        filter((user) => user === null || user !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        let firstName: string;
        let lastName = '';

        if (user!.given_name && user!.family_name) {
          firstName = user!.given_name;
          lastName = user!.family_name;
        } else if (user!.given_name) {
          firstName = user!.given_name;
        } else {
          firstName = user!.name!;
        }

        const appUser: User = {
          _id: user!.sub!,
          firstName: firstName,
          lastName: lastName,
          profilePicture: user!.picture!,
          createdAt: '',
          updatedAt: user!.updated_at!,
          lastLogin: '',
        };
        this.userService.login(appUser);
      });
  }

  onResizeSidebar(width: number) {
    this.sidebarWidth.set(width);
  }
}
