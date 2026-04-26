import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';
import { auth0Config } from '@nexosdi.synapxix/auth0-config';
import { routes } from './app.routes';

function getRedirectUri(): string {
  if (typeof window === 'undefined' || !window.location) {
    return 'http://localhost:4300';
  }

  return window.location.origin;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    provideAuth0({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        audience: auth0Config.audience,
        redirect_uri: getRedirectUri(),
        scope: auth0Config.scope,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${auth0Config.api.baseUrl}/*`,
            tokenOptions: {
              authorizationParams: {
                audience: auth0Config.audience,
              },
            },
          },
        ],
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    }),
  ],
};
