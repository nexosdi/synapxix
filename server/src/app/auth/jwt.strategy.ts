import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';

export type KeycloakJwtPayload = {
  [key: string]: unknown;
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: { roles: string[] };
};

/**
 * Estrategia de Passport para validar tokens JWT (Bearer tokens).
 * Integrado con el Keycloak del VPS. Descarga las llaves públicas (JWKS) desde la URL
 * configurada para verificar criptográficamente que los tokens no fueron alterados.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const realmUrl = process.env.KEYCLOAK_REALM_URL || 'http://localhost:8080/realms/synapxix';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 600_000,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${realmUrl}/protocol/openid-connect/certs`,
      }),
      issuer: realmUrl,
      algorithms: ['RS256'],
    });
  }

  validate(payload: KeycloakJwtPayload) {
    return payload;
  }
}

function normalizeIssuer(domain: string): string {
  const sanitized = domain.startsWith('http')
    ? domain.replace(/\/+$/, '')
    : `https://${domain}`.replace(/\/+$/, '');

  return `${sanitized}/`;
}
