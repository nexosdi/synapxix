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
  // URL relativa: las llamadas salen al mismo origen y en desarrollo las
  // redirige el proxy del dev-server (web-game/proxy.conf.js) al backend.
  // Así el puerto del backend se configura en un solo lugar, y en producción
  // funciona sin cambios cuando el front se sirve junto a la API.
  // El /api corresponde al prefijo global que define main.ts (setGlobalPrefix).
  apiUrl: '/api',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'Synapxix',
    clientId: 'synapxix-app',
  },
};
