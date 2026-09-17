import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TeacherAccessGuard } from './teacher-access.guard';

@Global()
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, TeacherAccessGuard],
  exports: [PassportModule, JwtAuthGuard, TeacherAccessGuard],
})
export class AuthModule {}