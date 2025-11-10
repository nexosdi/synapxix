import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  getData(user?: Request['user']): {
    message: string;
    user?: {
      sub?: string;
      email?: string;
      name?: string;
    };
  } {
    return {
      message: 'Hello API',
      user: user
        ? {
            sub: typeof user.sub === 'string' ? user.sub : undefined,
            email: typeof user.email === 'string' ? user.email : undefined,
            name: typeof user.name === 'string' ? user.name : undefined,
          }
        : undefined,
    };
  }
}
