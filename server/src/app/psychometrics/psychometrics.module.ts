import { Module } from '@nestjs/common';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { PsychometricsController } from './psychometrics.controller';
import { PsychometricsService } from './psychometrics.service';
import { PsychometricsRepository } from './psychometrics.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PsychometricsController],
  providers: [PsychometricsService, PsychometricsRepository],
})
export class PsychometricsModule {}
