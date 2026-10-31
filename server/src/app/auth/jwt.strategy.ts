import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwksRsa from 'jwks-rsa';
import { PrismaService } from '@nexosdi.synapxix/prisma';

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
 * Estrategia de Passport para validar tokens JWT (Bearer tokens).
 * Integrado con el Keycloak del VPS. Descarga las llaves públicas (JWKS) desde la URL
 * configurada para verificar criptográficamente que los tokens no fueron alterados.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly prisma: PrismaService) {
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

  async validate(payload: KeycloakJwtPayload) {
    const roles = payload.realm_access?.roles || [];
    const userId = payload.sub;

    if (userId) {
      try {
        // Just-In-Time (JIT) provisioning:
        // Automatically sync Keycloak authenticated users into the local `auth.app_user` table.
        // This guarantees referential integrity for downstream entities with foreign keys (e.g. dala_consent).
        const username =
          payload.preferred_username ||
          (payload.email ? payload.email.split('@')[0] : userId);
        const email = payload.email || `${username}@synapxix.local`;
        const firstname =
          (payload['given_name'] as string) ||
          (payload.name ? payload.name.split(' ')[0] : 'User');
        const lastname =
          (payload['family_name'] as string) ||
          (payload.name && payload.name.split(' ').length > 1
            ? payload.name.split(' ').slice(1).join(' ')
            : 'Synapxix');
        const role = roles.includes('teacher')
          ? 'teacher'
          : roles.includes('director')
          ? 'director'
          : roles.includes('student')
          ? 'student'
          : 'user';

        await this.prisma.app_user.upsert({
          where: { user_id: userId },
          update: {
            username,
            email,
            role,
          },
          create: {
            user_id: userId,
            username,
            email,
            firstname,
            lastname,
            role,
          },
        });
      } catch (err) {
        // Log warning on failure without blocking request authentication pipeline
        this.logger.warn(
          `JIT User Provisioning failed for user "${userId}": ${(err as Error).message}`
        );
      }
    }

    return {
      ...payload,
      roles,
    };
  }
}


