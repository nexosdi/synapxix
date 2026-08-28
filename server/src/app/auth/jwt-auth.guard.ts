import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MockJwtGuard } from './mock-jwt.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly mockGuard = new MockJwtGuard();

  override canActivate(context: ExecutionContext) {
    if (process.env.DISABLE_AUTH === 'true') {
      return this.mockGuard.canActivate(context);
    }

    return super.canActivate(context);
  }
}
