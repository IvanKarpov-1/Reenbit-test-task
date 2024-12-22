import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { DividerComponent } from './core/layout/divider/divider.component';
import { MainContentComponent } from './core/layout/main-content/main-content.component';
import { NgStyle } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './features/user/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
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
    this.auth.isAuthenticated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.userService.login();
        }
      });
  }

  onResizeSidebar(width: number) {
    this.sidebarWidth.set(width);
  }
}
