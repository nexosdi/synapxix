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
    if (!this.authenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
