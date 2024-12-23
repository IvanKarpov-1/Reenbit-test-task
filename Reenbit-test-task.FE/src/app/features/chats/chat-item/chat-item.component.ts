import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ProfilePictureComponent } from '../../../shared/components/profile-picture/profile-picture.component';
import { RouterLink } from '@angular/router';
import { Chat } from '../chat.model';
import { RecencyDatePipe } from '../../../shared/pipes/recency-date.pipe';
import { User } from '../../user/user.model';
import { AuthService } from '@auth0/auth0-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-item',
  standalone: true,
  imports: [ProfilePictureComponent, RouterLink, RecencyDatePipe],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent implements OnInit {
  chat = input.required<Chat>();
  interlocutor = signal<User | undefined>(undefined);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user?.sub !== this.chat().user1._id) {
          this.interlocutor.set(this.chat().user1);
        } else {
          this.interlocutor.set(this.chat().user2);
        }
      });
  }
}
