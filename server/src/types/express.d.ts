import 'express-serve-static-core';
import type { Auth0JwtPayload } from '../app/auth/jwt.strategy';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Auth0JwtPayload;
  }
}
