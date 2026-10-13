import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUserProvisioningService } from './authenticated-user-provisioning.service';

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

export function getKeycloakJwtConfig(env: NodeJS.ProcessEnv = process.env) {
  const realmUrl = env.KEYCLOAK_REALM_URL || 'http://localhost:8080/realms/synapxix';

  return {
    jwksUri: `${realmUrl}/protocol/openid-connect/certs`,
    issuer: env.KEYCLOAK_EXPECTED_ISSUER || realmUrl,
  };
}

/**
 * Estrategia de Passport para validar tokens JWT (Bearer tokens).
 * Integrado con el Keycloak del VPS. Descarga las llaves públicas (JWKS) desde la URL
 * configurada para verificar criptográficamente que los tokens no fueron alterados.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly provisioning: AuthenticatedUserProvisioningService) {
    const jwtConfig = getKeycloakJwtConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 600_000,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: jwtConfig.jwksUri,
      }),
      issuer: jwtConfig.issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: KeycloakJwtPayload) {
    const userId = payload.sub;
    if (typeof userId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
      throw new UnauthorizedException('Invalid authenticated subject');
    }

    await this.provisioning.ensureUser(payload);
    return payload;
  }
}

function normalizeIssuer(domain: string): string {
  const sanitized = domain.startsWith('http')
    ? domain.replace(/\/+$/, '')
    : `https://${domain}`.replace(/\/+$/, '');

  return `${sanitized}/`;
}
