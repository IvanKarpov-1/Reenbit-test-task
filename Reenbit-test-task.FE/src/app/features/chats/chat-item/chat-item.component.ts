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
import { filter } from 'rxjs';

@Component({
  selector: 'app-chat-item',
  imports: [ProfilePictureComponent, RouterLink, RecencyDatePipe],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.css',
})
export class ChatItemComponent implements OnInit {
  chat = input.required<Chat>();
  private interlocutor = signal<User | undefined>(undefined);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  get profilePicture() {
    switch (this.chat().chatType) {
      case 'AutoResponse':
        return this.chat().virtualUser.profilePicture;
      case 'Personal':
        return this.interlocutor()!.profilePicture;
      case 'Group':
        return this.chat().chatImage;
    }
  }

  get name() {
    switch (this.chat().chatType) {
      case 'AutoResponse':
        return `${this.chat().virtualUser.firstName} ${this.chat().virtualUser.lastName}`;
      case 'Personal':
        return `${this.interlocutor()!.firstName} ${this.interlocutor()!.lastName}`;
      case 'Group':
        return this.chat().name;
    }
  }

  ngOnInit() {
    this.auth.user$
      .pipe(
        filter((user) => user === null || user !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((user) => {
        if (this.chat().chatType === 'Personal') {
          this.interlocutor.set(
            this.chat()
              .participants.filter(
                (participant) => participant.user._id !== user!.sub!
              )
              .pop()?.user
          );
        }
      });
  }
}
