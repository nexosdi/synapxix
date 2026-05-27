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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Mantenemos la DI para el interceptor basado en clases
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
        // El audience debe ser EXACTAMENTE el Identifier de tu API en Auth0
        audience: 'http://localhost:3000/api', 
        redirect_uri: window.location.origin,
        scope: 'openid profile email', 
      },
      httpInterceptor: {
        allowedList: [
          {
            // El asterisco permite que todas las rutas bajo /api lleven el token
            uri: 'http://localhost:3000/api/*',
            tokenOptions: {
              authorizationParams: {
                audience: 'http://localhost:3000/api',
              },
            },
          },
        ],
      },
      // Cambiamos a 'localstorage' para persistencia, pero sin Refresh Tokens por ahora
      // para eliminar el error "Missing Refresh Token" de raíz.
      cacheLocation: 'localstorage',
      useRefreshTokens: false, 
    }),
  ],
};