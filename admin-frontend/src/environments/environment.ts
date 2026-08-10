export const environment = {
  production: false,
  // URL relativa: en desarrollo el proxy del dev-server (admin-frontend/proxy.conf.js)
  // la redirige al backend, así el puerto se configura en un solo lugar.
  apiUrl: '/api',
  gameAppUrl: 'http://localhost:4300',
  // TODO: flip to true when GET /notifications ships on the backend
  notificationsApiReady: false,
};