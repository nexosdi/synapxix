import 'express-serve-static-core';
import type { KeycloakJwtPayload } from '../app/auth/jwt.strategy';

/**
 * Extensión de los tipos globales de Express.
 * Le indica a TypeScript que `req.user` ahora contiene la estructura del token de Keycloak (KeycloakJwtPayload),
 * permitiendo autocompletado de propiedades como `preferred_username` o `realm_access`.
 */
declare module 'express-serve-static-core' {
  interface Request {
    user?: KeycloakJwtPayload;
  }
}
