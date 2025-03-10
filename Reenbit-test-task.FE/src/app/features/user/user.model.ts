export interface UserSettings {
  isSendRandomAutomaticMessages: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  settings?: UserSettings;
}
