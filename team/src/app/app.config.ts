import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

/**
 * Primer Pulso no usa Keycloak: la identidad es el token de invitación que
 * emite /api/team/v1/join y que PulseApiService adjunta a cada request.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient()],
};
