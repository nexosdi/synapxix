/**
 * Proxy del dev-server: redirige /api al backend NestJS local.
 * Mismo criterio que web-game: el puerto sale de SYNAPXIX_API_PORT o PORT.
 */
const port = process.env.SYNAPXIX_API_PORT || process.env.PORT || 3000;

module.exports = {
  '/api': {
    target: `http://localhost:${port}`,
    secure: false,
  },
};
