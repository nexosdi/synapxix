import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MockJwtGuard } from './mock-jwt.guard';

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: JwtAuthGuard,
      useClass: process.env.DISABLE_AUTH === 'true' ? MockJwtGuard : JwtAuthGuard,
    },
  ],
  exports: [PassportModule, JwtAuthGuard],
})
export class AuthModule {}