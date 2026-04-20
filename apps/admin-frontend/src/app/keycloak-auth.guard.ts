import { Injectable } from '@angular/core';
import {
  KeycloakAuthGuard,
  KeycloakService,
} from 'keycloak-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected keycloakService: KeycloakService
  ) {
    super(router, keycloakService);
  }

  async isAccessAllowed(): Promise<boolean> {
    // Verificamos si el usuario está autenticado de forma explícita
    const loggedIn = await this.keycloakService.isLoggedIn();

    if (!loggedIn) {
      console.warn('[AuthGuard] Usuario no autenticado, redirigiendo a login...');
      await this.keycloakService.login({
        redirectUri: window.location.origin + '/dashboard',
      });
      return false;
    }

    return true;
  }
}
