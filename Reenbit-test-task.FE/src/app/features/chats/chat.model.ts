import { User } from '../user/user.model';

export interface Chat {
  _id: string;
  participants: { user: User }[];
  lastMessage: any;
  chatType: 'AutoResponse' | 'Personal' | 'Group';
  name: string;
  chatImage: string;
  virtualUser: {
    profilePicture: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}
