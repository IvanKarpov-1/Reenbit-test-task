import { HttpInterceptorFn } from '@angular/common/http';
import {
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { authHttpInterceptorFn, AuthService } from '@auth0/auth0-angular';
import { EMPTY, switchMap, take } from 'rxjs';
import { ToastsService } from '../../shared/components/toast/toasts.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const environmentInjector = inject(EnvironmentInjector);
  const toastsService = inject(ToastsService);

  return authService.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        toastsService.showToast(
          'error',
          'You must authenticate to perform this action'
        );
        return EMPTY;
      }

      return runInInjectionContext(environmentInjector, () => {
        return authHttpInterceptorFn(req, next);
      });
    })
  );
};
