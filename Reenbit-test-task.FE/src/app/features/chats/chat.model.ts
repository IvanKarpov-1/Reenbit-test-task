import { User } from '../user/user.model';

export interface Chat {
  _id: string;
  user1: User;
  user2: User;
  lastMessage: any;
  createdAt: string;
  updatedAt: string;
}
