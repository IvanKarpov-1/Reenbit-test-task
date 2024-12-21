import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'callback',
    loadComponent: () =>
      import('./core/auth/pages/callback/callback.component').then(
        (mod) => mod.CallbackComponent
      ),
  },
];
