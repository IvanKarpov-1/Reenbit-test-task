import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { apiBaseUrlInterceptor } from './core/interceptors/api.interceptors';
import { authHttpInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiBaseUrlInterceptor, authHttpInterceptor])
    ),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        audience: environment.auth0.audience,
        redirect_uri: environment.auth0.redirect_uri,
      },
      cacheLocation: 'localstorage',
      errorPath: '/callback',
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [`${environment.apiBaseUrl}/*`],
      },
    }),
  ],
};
