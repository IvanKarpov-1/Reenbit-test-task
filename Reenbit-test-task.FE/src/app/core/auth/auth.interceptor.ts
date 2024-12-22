import { HttpInterceptorFn } from '@angular/common/http';
import {
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { authHttpInterceptorFn, AuthService } from '@auth0/auth0-angular';
import { switchMap, take } from 'rxjs';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const environmentInjector = inject(EnvironmentInjector);

  return authService.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return blankInterceptor(req, next);
      }

      return runInInjectionContext(environmentInjector, () => {
        return authHttpInterceptorFn(req, next);
      });
    })
  );
};

const blankInterceptor: HttpInterceptorFn = (req, next) => next(req);
