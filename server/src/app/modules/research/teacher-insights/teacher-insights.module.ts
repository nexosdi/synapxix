import { Module } from '@nestjs/common';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { ResearchModule } from '../research.module';
import { TeacherInsightsController } from './teacher-insights.controller';
import { TeacherInsightsService } from './teacher-insights.service';
import { TeacherInsightsRepository } from './teacher-insights.repository';
import { TeacherInsightsCron } from './teacher-insights.cron';


@Module({
  imports: [PrismaModule, ResearchModule],
  controllers: [TeacherInsightsController],
  providers: [TeacherInsightsService, TeacherInsightsRepository, TeacherInsightsCron],
  exports: [TeacherInsightsService],
})
export class TeacherInsightsModule {}