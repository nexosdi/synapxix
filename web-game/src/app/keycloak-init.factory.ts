import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';

/**
 * Initializes the Keycloak instance before Angular starts.
 * - Connects to the Keycloak server hosted on the VPS.
 * - Enables silent SSO session check.
 * - Activates the Bearer Interceptor to automatically attach the access token
 *   to every outgoing request that targets the backend API (/api/*).
 *
 * The `bearerExcludedUrls` list prevents the interceptor from forwarding
 * the app's token to Keycloak's own endpoints, which would cause 401 errors.
 *
 * @param keycloak Injected Keycloak service instance
 * @returns Promise that resolves when Keycloak finishes initialization
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
        // The 3p-cookies endpoint was removed in Keycloak 25+.
        // Disabling the fallback prevents the adapter from trying to load
        // /realms/.../3p-cookies/step1.html, which would 404 and block init.
        silentCheckSsoFallback: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      // Exclude Keycloak's own endpoints and the silent SSO page from receiving
      // the app's Bearer token. All /api/* routes will receive it automatically.
      bearerExcludedUrls: [
        '/assets',
        '/silent-check-sso.html',
        environment.keycloak.url,
      ],
    }).catch(err => {
      console.warn('Keycloak initialization failed, proceeding offline/unauthenticated', err);
      return false;
    });
}
