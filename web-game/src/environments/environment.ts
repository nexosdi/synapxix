/**
 * Configuración de entorno para desarrollo local.
 * Contiene la configuración de conexión al servidor Keycloak del VPS.
 */
export const environment = {
  apiUrl: '', // La URL de tu backend local (ej. 'http://localhost:3000')
  keycloak: {
    url: 'https://auth.aisuite.neops.ai',
    realm: 'Synapxix',
    clientId: 'synapxix-app',
  },
};
