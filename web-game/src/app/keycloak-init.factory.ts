import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

/**
 * Inicializa la instancia de Keycloak antes de que Angular inicie.
 * - Conecta con el Keycloak alojado en el VPS.
 * - Habilita la comprobación silenciosa de sesión (SSO).
 * - Activa el Bearer Interceptor para adjuntar automáticamente el token en peticiones al backend.
 * 
 * @param keycloak Instancia inyectada del servicio de Keycloak
 * @returns Promesa que se resuelve cuando Keycloak termina su inicialización
 */
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
    }).catch(err => {
      console.warn('Keycloak initialization failed, proceeding offline/unauthenticated', err);
      return false;
    });
}
