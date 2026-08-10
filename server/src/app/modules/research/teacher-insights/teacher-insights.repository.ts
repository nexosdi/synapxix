import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { TeacherInsightReport, linkType } from '@prisma/client';
import {
  TeacherMetricsSummaryDto,
  GameTypeBreakdown,
  StrugglingContent,
} from './dto/teacher-metrics-summary.dto';

/**
 * TeacherInsightsRepository — data access for the weekly teacher-insights
 * cron job.
 *
 * Responsible for:
 *   1. Resolving which teachers have an active group of students
 *      (via UserLink with link_type = TEACHER).
 *   2. Aggregating that group's weekly performance metrics
 *      (CognitiveMetric, GameAttempt, UserContentProgress).
 *   3. Persisting the AI-generated report, associated to the teacher.
 */
@Injectable()
export class TeacherInsightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the distinct list of teacher user_ids that currently have at
   * least one linked student (UserLink TEACHER -> STUDENT).
   */
  async findTeacherIdsWithStudents(): Promise<string[]> {
    const links = await this.prisma.userLink.findMany({
      where: {
        link_type: linkType.TEACHER,
        id_user_from: { not: null },
        id_user_to: { not: null },
      },
      select: { id_user_from: true },
      distinct: ['id_user_from'],
    });

    return links
      .map((l) => l.id_user_from)
      .filter((id): id is string => !!id);
  }

  /**
   * Returns the student user_ids linked to a given teacher.
   */
  async findStudentIdsForTeacher(teacherId: string): Promise<string[]> {
    const links = await this.prisma.userLink.findMany({
      where: {
        link_type: linkType.TEACHER,
        id_user_from: teacherId,
        id_user_to: { not: null },
      },
      select: { id_user_to: true },
    });

    return links
      .map((l) => l.id_user_to)
      .filter((id): id is string => !!id);
  }

  /**
   * Compiles the aggregated weekly metrics for a teacher's group of
   * students within [periodStart, periodEnd).
   */
  async buildWeeklyMetricsSummary(
    teacherId: string,
    studentIds: string[],
    periodStart: Date,
    periodEnd: Date,
  ): Promise<TeacherMetricsSummaryDto> {
    const dateRange = { gte: periodStart, lt: periodEnd };

    const [cognitiveAgg, activeStudentIds, attemptRows, progressAgg, progressByContent] =
      await Promise.all([
        this.prisma.cognitiveMetric.aggregate({
          where: { user_id: { in: studentIds }, created_at: dateRange },
          _avg: {
            accuracy: true,
            reaction_time: true,
            cognitive_load: true,
            memory_retention: true,
            attention_span: true,
          },
        }),
        this.prisma.gameSession.findMany({
          where: {
            user_id: { in: studentIds },
            started_at: dateRange,
          },
          select: { user_id: true },
          distinct: ['user_id'],
        }),
        this.prisma.gameAttempt.findMany({
          where: {
            created_at: dateRange,
            session: { user_id: { in: studentIds } },
          },
          select: {
            game_type: true,
            is_correct: true,
            score: true,
            completed_quickly: true,
          },
        }),
        this.prisma.userContentProgress.aggregate({
          where: { user_id: { in: studentIds }, last_update: dateRange },
          _avg: { progress: true },
          _count: { _all: true },
        }),
        this.prisma.userContentProgress.groupBy({
          by: ['content_id'],
          where: { user_id: { in: studentIds }, last_update: dateRange },
          _avg: { progress: true },
          orderBy: { _avg: { progress: 'asc' } },
          take: 5,
        }),
      ]);

    const totalAttempts = attemptRows.length;
    const correctAttempts = attemptRows.filter((a) => a.is_correct).length;
    const quickAttempts = attemptRows.filter((a) => a.completed_quickly).length;
    const averageScore =
      totalAttempts > 0
        ? attemptRows.reduce((sum, a) => sum + a.score, 0) / totalAttempts
        : 0;

    const byGameType = this.buildGameTypeBreakdown(attemptRows);
    const strugglingContent = await this.resolveContentTitles(progressByContent);

    return {
      teacherId,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      studentCount: studentIds.length,
      activeStudents: activeStudentIds.length,
      cognitive: {
        accuracy: cognitiveAgg._avg.accuracy ?? 0,
        reactionTime: cognitiveAgg._avg.reaction_time ?? 0,
        cognitiveLoad: cognitiveAgg._avg.cognitive_load ?? 0,
        memoryRetention: cognitiveAgg._avg.memory_retention ?? 0,
        attentionSpan: cognitiveAgg._avg.attention_span ?? 0,
      },
      gameAttempts: {
        totalAttempts,
        successRate: totalAttempts > 0 ? correctAttempts / totalAttempts : 0,
        averageScore,
        quickCompletionRate: totalAttempts > 0 ? quickAttempts / totalAttempts : 0,
        byGameType,
      },
      contentProgress: {
        averageProgress: progressAgg._avg.progress ?? 0,
        completedCount: progressAgg._count._all,
        strugglingContent,
      },
    };
  }

  /**
   * Persists the generated report. Uses upsert so a manual re-run for the
   * same period doesn't violate the unique (teacher_id, period_start, period_end)
   * constraint — it simply overwrites the previous version.
   */
  async saveReport(params: {
    teacherId: string;
    periodStart: Date;
    periodEnd: Date;
    studentCount: number;
    activeStudents: number;
    metricsSummary: TeacherMetricsSummaryDto;
    reportText: string;
  }): Promise<TeacherInsightReport> {
    const { teacherId, periodStart, periodEnd, studentCount, activeStudents, metricsSummary, reportText } =
      params;

    return this.prisma.teacherInsightReport.upsert({
      where: {
        teacher_id_period_start_period_end: {
          teacher_id: teacherId,
          period_start: periodStart,
          period_end: periodEnd,
        },
      },
      update: {
        student_count: studentCount,
        active_students: activeStudents,
        metrics_summary: metricsSummary as unknown as object,
        report_text: reportText,
        status: 'GENERATED',
      },
      create: {
        teacher_id: teacherId,
        period_start: periodStart,
        period_end: periodEnd,
        student_count: studentCount,
        active_students: activeStudents,
        metrics_summary: metricsSummary as unknown as object,
        report_text: reportText,
        status: 'GENERATED',
      },
    });
  }

  /**
   * Fetches the reports stored for a teacher, most recent first — used to
   * feed the dashboard.
   */
  async findReportsByTeacher(teacherId: string, limit = 12): Promise<TeacherInsightReport[]> {
    return this.prisma.teacherInsightReport.findMany({
      where: { teacher_id: teacherId },
      orderBy: { period_start: 'desc' },
      take: limit,
    });
  }

  private buildGameTypeBreakdown(
    attempts: { game_type: string; is_correct: boolean; score: number; completed_quickly: boolean | null }[],
  ): GameTypeBreakdown[] {
    const groups = new Map<string, { attempts: number; correct: number; scoreSum: number }>();

    for (const attempt of attempts) {
      const bucket = groups.get(attempt.game_type) ?? { attempts: 0, correct: 0, scoreSum: 0 };
      bucket.attempts += 1;
      bucket.correct += attempt.is_correct ? 1 : 0;
      bucket.scoreSum += attempt.score;
      groups.set(attempt.game_type, bucket);
    }

    return Array.from(groups.entries()).map(([gameType, bucket]) => ({
      gameType,
      attempts: bucket.attempts,
      successRate: bucket.attempts > 0 ? bucket.correct / bucket.attempts : 0,
      averageScore: bucket.attempts > 0 ? bucket.scoreSum / bucket.attempts : 0,
    }));
  }

  private async resolveContentTitles(
    rows: { content_id: string; _avg: { progress: number | null } }[],
  ): Promise<StrugglingContent[]> {
    if (rows.length === 0) return [];

    const contents = await this.prisma.content.findMany({
      where: { content_id: { in: rows.map((r) => r.content_id) } },
      select: { content_id: true, title: true },
    });
    const titleById = new Map(contents.map((c) => [c.content_id, c.title]));

    return rows.map((r) => ({
      contentId: r.content_id,
      title: titleById.get(r.content_id) ?? 'Untitled',
      averageProgress: r._avg.progress ?? 0,
    }));
  }
}