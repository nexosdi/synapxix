import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return async () => {
    try {
      
      await keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'prueba',
          clientId: 'angular-client',
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
