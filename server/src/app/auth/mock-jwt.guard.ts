import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Emulate a standard teacher user session for local development/demo
    request.user = {
      sub: 'auth0|mock_teacher_id',
      user_id: 'mock_teacher_id',
      'https://synapxix.com/roles': ['teacher'],
    };
    return true;
  }
}
