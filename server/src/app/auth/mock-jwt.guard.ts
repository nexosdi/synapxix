import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Identificador del usuario de desarrollo.
 *
 * Los controladores usan `req.user.sub` como `user_id` contra la base, y esa
 * columna es UUID con clave foránea, así que el valor debe ser un UUID que
 * exista realmente en `auth.app_user`. El seed de desarrollo
 * (`libs/prisma/src/seeds/dev.seed.ts`) crea ese usuario con este mismo id.
 */
export const MOCK_USER_ID = '00000000-0000-4000-8000-000000000001';

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
      sub: MOCK_USER_ID,
      preferred_username: 'teacher_dev',
      email: 'teacher@dev.local',
      realm_access: { roles: ['teacher'] },
    };
    return true;
  }
}
