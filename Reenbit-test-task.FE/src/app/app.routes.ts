import { Routes } from '@angular/router';
import { chatPageResolver } from './features/chats/chat-page/chat-page.resolver';

export const routes: Routes = [
  {
    path: 'callback',
    loadComponent: () =>
      import('./core/auth/pages/callback/callback.component').then(
        (mod) => mod.CallbackComponent
      ),
  },
  {
    path: ':chatId',
    loadComponent: () =>
      import('./features/chats/chat-page/chat-page.component').then(
        (mod) => mod.ChatPageComponent
      ),
    resolve: {
      chat: chatPageResolver,
    },
  },
];
