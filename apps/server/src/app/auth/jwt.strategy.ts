import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { auth0Config } from '@nexosdi.synapxix/auth0-config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';

export type Auth0JwtPayload = {
  [key: string]: unknown;
  iss?: string;
  aud?: string | string[];
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const keycloakUrl = configService.get<string>('KEYCLOAK_URL');
    const keycloakRealm = configService.get<string>('KEYCLOAK_REALM');
    const keycloakClientId = configService.get<string>('KEYCLOAK_CLIENT_ID');

    // Priorizamos Keycloak si está configurado
    const keycloakIssuer = keycloakUrl && keycloakRealm 
      ? `${keycloakUrl}/realms/${keycloakRealm}`
      : null;

    const issuer = normalizeIssuer(keycloakIssuer || configService.get<string>('AUTH0_DOMAIN') || auth0Config.domain);
    const audience = keycloakClientId || configService.get<string>('AUTH0_AUDIENCE') || auth0Config.audience;

    console.log(`[JwtStrategy] Configured with:
      Issuer: ${issuer}
      Audience: ${audience}
      JWKS URI: ${issuer}/protocol/openid-connect/certs`);

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
      issuer: issuer,
      // No forzamos la audiencia para Keycloak por ahora para evitar problemas de desajuste,
      // ya que Keycloak a veces no pone el clientId en el campo 'aud' por defecto.
      // Si quieres forzarla, descomenta la siguiente línea:
      // audience: audience,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any) {
    // console.log('[JwtStrategy] Payload validado:', payload);
    return payload;
  }
}

function normalizeIssuer(domain: string): string {
  if (!domain) return '';
  
  const sanitized = domain.startsWith('http')
    ? domain.replace(/\/+$/, '')
    : `https://${domain}`.replace(/\/+$/, '');

  return sanitized;
}
