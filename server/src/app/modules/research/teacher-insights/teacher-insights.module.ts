import { Module } from '@nestjs/common';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { ResearchModule } from '../research/research.module';
import { TeacherInsightsController } from './teacher-insights.controller';
import { TeacherInsightsService } from './teacher-insights.service';
import { TeacherInsightsRepository } from './teacher-insights.repository';
import { TeacherInsightsCron } from './teacher-insights.cron';

/**
 * TeacherInsightsModule — AI-assisted weekly pedagogical reports for teachers.
 *
 * Imports ResearchModule to reuse AiProvider (Gemini) and AiPromptService
 * (versioned/cached system prompts) instead of duplicating AI wiring.
 *
 * Registers TeacherInsightsCron, which requires ScheduleModule.forRoot()
 * to be registered once, globally, in AppModule.
 */
@Module({
  imports: [PrismaModule, ResearchModule],
  controllers: [TeacherInsightsController],
  providers: [TeacherInsightsService, TeacherInsightsRepository, TeacherInsightsCron],
  exports: [TeacherInsightsService],
})
export class TeacherInsightsModule {}