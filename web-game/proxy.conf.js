/**
 * Proxy del dev-server: redirige /api al backend NestJS.
 *
 * El puerto se puede cambiar con SYNAPXIX_API_PORT (en el .env de la raíz),
 * útil cuando el 3000 ya está ocupado por otro proyecto en la máquina.
 * Ese valor debe coincidir con el PORT con el que arranca el server.
 */
const port = process.env.SYNAPXIX_API_PORT || process.env.PORT || 3000;

module.exports = {
  '/api': {
    target: `http://localhost:${port}`,
    secure: false,
  },
};
