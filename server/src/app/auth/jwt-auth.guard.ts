import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // In local development, if no Authorization header is present, bypass verification and mock user
    if (!authHeader && process.env.NODE_ENV !== 'production') {
      request.user = {
        sub: 'auth0|mock_teacher_id',
        user_id: 'mock_teacher_id',
        'https://synapxix.com/roles': ['teacher'],
      };
      return true;
    }

    return super.canActivate(context);
  }
}
