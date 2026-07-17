import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { routes } from './app.routes';
import { initializeKeycloak } from './keycloak-init.factory';

/**
 * Configuración global de la aplicación Angular.
 * Incluye la provisión de rutas, cliente HTTP y la integración de Keycloak.
 * 
 * - APP_INITIALIZER: Ejecuta la conexión con Keycloak del VPS antes de cargar la app.
 * - HTTP_INTERCEPTORS: Agrega el interceptor que inyecta el token Bearer de Keycloak a cada Request.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Mantenemos la DI para el interceptor basado en clases
    provideHttpClient(withInterceptorsFromDi()), 
    
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ],
};