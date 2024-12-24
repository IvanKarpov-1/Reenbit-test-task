import { inject, Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../../features/chats/chat.model';
import { UserService } from '../../features/user/user.service';

@Pipe({
  name: 'chatName',
})
export class ChatNamePipe implements PipeTransform {
  private readonly userService = inject(UserService);
  private readonly userId = this.userService.userId;

  transform(chat: Chat | undefined): string {
    if (!chat) return '';

    switch (chat.chatType) {
      case 'AutoResponse':
        return `${chat!.virtualUser.firstName} ${chat!.virtualUser.lastName}`;
      case 'Personal':
        const interlocutor = chat!.participants.find(
          (chat) => chat.user._id === this.userId()
        )!.user;

        return `${interlocutor!.firstName} ${interlocutor!.lastName}`;
      case 'Group':
        return chat!.name;
    }
  }
}
