import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TeacherAccessGuard } from './teacher-access.guard';
import { AuthenticatedUserProvisioningService } from './authenticated-user-provisioning.service';

@Global()
@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard, TeacherAccessGuard, AuthenticatedUserProvisioningService],
  exports: [PassportModule, JwtAuthGuard, TeacherAccessGuard],
})
export class AuthModule {}
