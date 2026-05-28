import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    try {
      
      await keycloak.init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
        },
      });
      
      const isLogged = await keycloak.isLoggedIn();
      
    } catch (err) {
      console.error('[Keycloak Init] Error:', err);
    }
  };
}
