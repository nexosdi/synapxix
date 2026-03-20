import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}/protocol/openid-connect/certs`,
      }),

      audience: configService.get<string>('KEYCLOAK_BACKEND_CLIENT_ID'),
      issuer: `${configService.get<string>('KEYCLOAK_URL')}/realms/${configService.get<string>('KEYCLOAK_REALM')}`,
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: Record<string, any>) {

    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido: falta identificador de usuario');
    }

    const realmRoles = payload.realm_access?.roles || [];
    const clientRoles = payload.resource_access?.[this.configService.get<string>('KEYCLOAK_BACKEND_CLIENT_ID')]?.roles || [];
    
    const roles = [...realmRoles, ...clientRoles];

    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: roles,
    };
  }
}
