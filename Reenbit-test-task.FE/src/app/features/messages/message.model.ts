import { User } from '../user/user.model';
import { Chat } from '../chats/chat.model';

export interface Message {
  _id: string;
  sender: User;
  senderPicture: string;
  chat: Chat;
  content: string;
  isAutoResponse: boolean;
  createdAt: string;
  updatedAt: string;
}
