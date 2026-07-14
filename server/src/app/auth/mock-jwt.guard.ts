import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Guard falso (Mock) para entornos de desarrollo local.
 * Se activa si la variable de entorno `DISABLE_AUTH=true`.
 * Simula que un usuario está logueado pasando un objeto con formato Keycloak a `req.user`.
 * Esto permite probar endpoints protegidos sin conectarse al servidor Keycloak.
 */
@Injectable()
export class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Emulate a standard teacher user session for local development/demo
    request.user = {
      sub: 'mock_teacher_id',
      preferred_username: 'teacher_dev',
      email: 'teacher@dev.local',
      realm_access: { roles: ['teacher'] },
    };
    return true;
  }
}
