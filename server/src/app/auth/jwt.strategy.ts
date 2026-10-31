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
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
  roles?: string[];
};

/**
 * Passport strategy for validating JWT Bearer tokens.
 * Integrated with the Keycloak instance. Downloads public keys (JWKS) from the
 * configured URL to cryptographically verify that tokens have not been tampered with.
 *
 * validate() is intentionally side-effect-free (no DB writes).
 * It runs on every authenticated request — any write here hits the DB on every
 * request, causing lock contention and connection pool exhaustion.
 *
 * JIT user provisioning (ensuring app_user exists for FK constraints) is handled
 * at the point of need in ConsentService.updateConsent(), not here.
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
    const roles = payload.realm_access?.roles || [];

    return {
      ...payload,
      roles,
    };
  }
}
