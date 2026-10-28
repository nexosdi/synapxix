import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

/**
 * Wraps KeycloakService so components don't depend on the identity
 * provider directly. Swapping Keycloak for another provider only
 * requires changing this file.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(KeycloakService);

  getUserId(): string | null {
    try {
      return this.keycloak.getKeycloakInstance().subject ?? null;
    } catch {
      console.error('Could not read the userId from Keycloak.');
      return null;
    }
  }
}
