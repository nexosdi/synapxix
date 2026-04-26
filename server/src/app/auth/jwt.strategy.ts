import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { auth0Config } from '@nexosdi.synapxix/auth0-config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';

export type JwtPayload = {
  [key: string]: unknown;
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const keycloakUrl = configService.get<string>('KEYCLOAK_URL');
    const keycloakRealm = configService.get<string>('KEYCLOAK_REALM');
    const keycloakClientId = configService.get<string>('KEYCLOAK_CLIENT_ID');

    const keycloakIssuer = keycloakUrl && keycloakRealm
      ? `${keycloakUrl}/realms/${keycloakRealm}`
      : null;

    const issuer = normalizeIssuer(
      keycloakIssuer ||
      configService.get<string>('AUTH0_DOMAIN') ||
      auth0Config.domain
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 1000 * 60 * 10,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }),
      issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}

function normalizeIssuer(domain: string): string {
  if (!domain) return '';
  return domain.startsWith('http')
    ? domain.replace(/\/+$/, '')
    : `https://${domain}`.replace(/\/+$/, '');
}
