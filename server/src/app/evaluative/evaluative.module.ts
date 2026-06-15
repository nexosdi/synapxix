import { Module } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluativeController } from './evaluative.controller';
import { ResearchModule } from '../modules/research/research.module';
import { PrismaModule } from '@nexosdi.synapxix/prisma';

@Module({
  imports: [ResearchModule, PrismaModule],
  controllers: [EvaluativeController],
  providers: [EvaluativeService],
})
export class EvaluativeModule {}

