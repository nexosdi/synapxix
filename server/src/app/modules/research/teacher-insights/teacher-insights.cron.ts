import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TeacherInsightsService } from './teacher-insights.service';

@Injectable()
export class TeacherInsightsCron {
  private readonly logger = new Logger(TeacherInsightsCron.name);

  constructor(private readonly teacherInsightsService: TeacherInsightsService) {}

  @Cron('0 3 * * 1', { name: 'weekly-teacher-insights' })
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
    const dayOfWeek = now.getUTCDay(); // 0 = domingo, 1 = lunes, ...
    const daysSinceMonday = (dayOfWeek + 6) % 7;

    const periodEnd = new Date(now);
    periodEnd.setUTCHours(0, 0, 0, 0);
    periodEnd.setUTCDate(periodEnd.getUTCDate() - daysSinceMonday);

    const periodStart = new Date(periodEnd);
    periodStart.setUTCDate(periodStart.getUTCDate() - 7);

    return { periodStart, periodEnd };
  }
}