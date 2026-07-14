import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

/**
 * Guard funcional que protege rutas requiriendo autenticación vía Keycloak.
 * - Verifica si el usuario tiene sesión activa.
 * - Si no está autenticado, lo redirige a la página de login del VPS de Keycloak.
 * - Permite validación de roles si se configuran en el parámetro `data` de la ruta.
 */
export const keycloakAuthGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  const isAuthenticated = keycloak.isLoggedIn();

  if (!isAuthenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }

  // Opcional: verificar roles desde route.data['roles']
  const requiredRoles: string[] = route.data?.['roles'] ?? [];
  if (requiredRoles.length === 0) {
    return true;
  }

  const userRoles = keycloak.getUserRoles();
  return requiredRoles.every(role => userRoles.includes(role));
};
