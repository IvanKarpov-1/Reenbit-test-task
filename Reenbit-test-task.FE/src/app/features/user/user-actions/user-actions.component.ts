import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { LogoutButtonComponent } from '../../../shared/components/buttons/logout-button/logout-button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-actions',
  imports: [DropdownComponent, LogoutButtonComponent, ReactiveFormsModule],
  templateUrl: './user-actions.component.html',
  styleUrl: './user-actions.component.css',
})
export class UserActionsComponent implements OnInit {
  isSendRandomAutomaticMessagesControl = new FormControl<boolean>(false);
  private readonly userService = inject(UserService);
  private readonly user = this.userService.user;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.isSendRandomAutomaticMessagesControl.setValue(
        this.user()?.settings?.isSendRandomAutomaticMessages ?? false
      );
    });
  }

  ngOnInit() {
    this.isSendRandomAutomaticMessagesControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        filter(
          (value) =>
            this.user() !== null &&
            this.user()?.settings!.isSendRandomAutomaticMessages !== value
        )
      )
      .subscribe((value) => {
        if (value !== null) {
          this.userService.updateSettings(
            'isSendRandomAutomaticMessages',
            value
          );
        }
      });
  }
}
