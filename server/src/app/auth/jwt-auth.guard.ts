import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MockJwtGuard } from './mock-jwt.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly mockGuard = new MockJwtGuard();

  override canActivate(context: ExecutionContext) {
    // El bypass se evalúa por request, no al construir el módulo: los guards
    // declarados con `@UseGuards(JwtAuthGuard)` se instancian desde la colección
    // `injectables` del módulo anfitrión, por lo que un `useClass` en el provider
    // nunca los reemplaza. Además, leer aquí garantiza que ConfigModule ya cargó
    // el .env.
    if (process.env.DISABLE_AUTH === 'true') {
      return this.mockGuard.canActivate(context);
    }

    return super.canActivate(context);
  }
}
