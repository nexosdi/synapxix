/**
 * Configuración de entorno para desarrollo local.
 *
 * Apunta al stack local levantado con docker compose: el backend en el 3000 y
 * el Keycloak del perfil `keycloak`, cuyo puerto se define con KEYCLOAK_PORT
 * (8081 acá porque el 8080 suele estar ocupado).
 *
 * Para usar el Keycloak del VPS en lugar del local:
 *   url: 'https://auth.aisuite.neops.ai'
 */
export const environment = {
  apiUrl: 'http://localhost:3000',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'Synapxix',
    clientId: 'synapxix-app',
  },
};
