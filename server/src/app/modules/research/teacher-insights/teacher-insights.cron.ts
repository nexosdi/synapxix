import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TeacherInsightsService } from './teacher-insights.service';

/**
 * TeacherInsightsCron — background worker that compiles weekly class
 * metrics and generates AI-assisted pedagogical reports for every teacher.
 *
 * Runs every Monday at 03:00 (server time), covering the previous Monday
 * 00:00 -> current Monday 00:00 window (a full ISO week), so reports are
 * ready before teachers start their day.
 *
 * Kept as a thin scheduling layer: all business logic lives in
 * TeacherInsightsService so it can also be triggered manually/on demand
 * (e.g. from an admin endpoint or a backfill script) without going through
 * the scheduler.
 */
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
      // The service already isolates per-teacher failures; this catch only
      // guards against unexpected top-level errors (e.g. DB connectivity)
      // so the cron doesn't crash the process.
      this.logger.error(`[CRON] Weekly teacher insights job crashed: ${error.message}`);
    }
  }

  /**
   * Computes the [previous Monday 00:00, this Monday 00:00) range, in
   * server-local time, relative to "now".
   */
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