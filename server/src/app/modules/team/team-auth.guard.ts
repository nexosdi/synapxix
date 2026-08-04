import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

/**
 * Identidad del Primer Pulso: token propio emitido en /team/v1/join a partir
 * de un link de invitación. Independiente de Keycloak a propósito — el piloto
 * de equipo es 100% online y sin fricción de cuentas.
 *
 * El payload liga member ↔ subject seudónimo: TODA autorización posterior
 * (ingesta, estado, decisiones) se resuelve contra `subjectId` del token,
 * nunca contra lo que diga el body.
 */
export interface TeamTokenPayload {
  /** member_id (core.team_member). */
  sub: string;
  /** Seudónimo D.A.L.A. resuelto en el join. */
  subjectId: string;
  name: string;
  scope: 'team-pulse';
}

export const TEAM_JWT_SECRET = () => {
  const secret = process.env.TEAM_JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    // En producción el default de desarrollo sería una puerta abierta.
    throw new Error('TEAM_JWT_SECRET es obligatoria en producción');
  }
  return secret ?? 'dev-team-pulse-secret-change-me';
};

@Injectable()
export class TeamAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { teamMember?: TeamTokenPayload }>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedException('missing_team_token');

    try {
      const payload = jwt.verify(token, TEAM_JWT_SECRET()) as TeamTokenPayload;
      if (payload.scope !== 'team-pulse') throw new Error('wrong_scope');
      request.teamMember = payload;
      return true;
    } catch {
      throw new UnauthorizedException('invalid_team_token');
    }
  }
}

/** Guard de administración: header con el código operativo del equipo. */
@Injectable()
export class TeamAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const code = request.headers['x-team-admin-code'];
    const expected = process.env.TEAM_ADMIN_CODE;
    if (!expected || code !== expected) {
      throw new UnauthorizedException('invalid_admin_code');
    }
    return true;
  }
}
