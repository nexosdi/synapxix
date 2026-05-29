import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // <-- 1. Importas el controlador

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  controllers: [AuthController], // <-- 2. Registras el controlador
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}