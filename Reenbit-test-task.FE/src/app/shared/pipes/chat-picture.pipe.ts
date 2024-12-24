import { inject, Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../features/user/user.service';
import { Chat } from '../../features/chats/chat.model';

@Pipe({
  name: 'chatPicture',
})
export class ChatPicturePipe implements PipeTransform {
  private readonly userService = inject(UserService);
  private readonly userId = this.userService.userId;

  transform(chat: Chat | undefined): string {
    if (!chat) return '';

    switch (chat!.chatType) {
      case 'AutoResponse':
        return chat!.virtualUser.profilePicture;
      case 'Personal':
        const interlocutor = chat!.participants.find(
          (chat) => chat.user._id === this.userId()
        )!.user;

        return interlocutor!.profilePicture ?? '';
      case 'Group':
        return chat!.chatImage;
    }
  }
}
