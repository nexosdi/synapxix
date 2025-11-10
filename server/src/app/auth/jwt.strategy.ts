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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const audience = process.env.AUTH0_AUDIENCE ?? auth0Config.audience;
    const issuer = normalizeIssuer(process.env.AUTH0_DOMAIN ?? auth0Config.domain);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 1000 * 60 * 10,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}.well-known/jwks.json`,
      }),
      audience,
      issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: Auth0JwtPayload) {
    return payload;
  }
}

function normalizeIssuer(domain: string): string {
  const sanitized = domain.startsWith('http')
    ? domain.replace(/\/+$/, '')
    : `https://${domain}`.replace(/\/+$/, '');

  return `${sanitized}/`;
}
