import { Module } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { DalaModule } from '../dala/dala.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamRepository } from './team.repository';
import { TeamAdminGuard, TeamAuthGuard } from './team-auth.guard';

/**
 * Primer Pulso — onboarding del equipo Synapxix como primera prueba real
 * de D.A.L.A. Este módulo aporta identidad por invitación, lo declarado y
 * el reporte; todo lo conductual pasa por la fachada de DalaModule
 * (regla: Synapxix usa D.A.L.A., no lo reimplementa).
 */
@Module({
  imports: [DalaModule],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository, TeamAuthGuard, TeamAdminGuard, PrismaService],
})
export class TeamModule {}
