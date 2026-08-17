import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TeacherInsightsService } from './teacher-insights.service';

@Injectable()
export class TeacherInsightsCron {
  private readonly logger = new Logger(TeacherInsightsCron.name);

  constructor(private readonly teacherInsightsService: TeacherInsightsService) {}

  @Cron(CronExpression.EVERY_WEEK, { name: 'weekly-teacher-insights' })
  async handleWeeklyInsightsGeneration(): Promise<void> {
    const { periodStart, periodEnd } = this.getPreviousWeekRange();

    this.logger.log(
      `[CRON] Triggering weekly teacher insights job for period ${periodStart.toISOString()} -> ${periodEnd.toISOString()}`,
    );

    try {
      const result = await this.teacherInsightsService.generateWeeklyReportsForAllTeachers(
        periodStart,
        periodEnd,
      );
      this.logger.log(
        `[CRON] Weekly teacher insights job finished. processed=${result.processed} failed=${result.failed}`,
      );
    } catch (error: any) {
  
      this.logger.error(`[CRON] Weekly teacher insights job crashed: ${error.message}`);
    }
  }

  private getPreviousWeekRange(): { periodStart: Date; periodEnd: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const daysSinceMonday = (dayOfWeek + 6) % 7;

    const periodEnd = new Date(now);
    periodEnd.setHours(0, 0, 0, 0);
    periodEnd.setDate(periodEnd.getDate() - daysSinceMonday);

    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - 7);

    return { periodStart, periodEnd };
  }
}