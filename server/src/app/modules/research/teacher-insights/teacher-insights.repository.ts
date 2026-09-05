import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { TeacherInsightReport, linkType } from '@prisma/client';
import {
  TeacherMetricsSummaryDto,
  GameTypeBreakdown,
  StrugglingContent,
} from './dto/teacher-metrics-summary.dto';


@Injectable()
export class TeacherInsightsRepository {
  constructor(private readonly prisma: PrismaService) {}

 
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

  async buildWeeklyMetricsSummary(
  teacherId: string,
  studentIds: string[],
  periodStart: Date,
  periodEnd: Date,
): Promise<TeacherMetricsSummaryDto> {
  const dateRange = { gte: periodStart, lt: periodEnd };
  const attemptsWhere = {
    created_at: dateRange,
    session: { user_id: { in: studentIds } },
  };

  const [
    cognitiveAgg,
    activeStudentIds,
    byGameTypeTotal,
    byGameTypeCorrect,
    overallAgg,
    correctCount,
    quickCount,
    progressAgg,
    progressByContent,
  ] = await Promise.all([
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
      where: { user_id: { in: studentIds }, started_at: dateRange },
      select: { user_id: true },
      distinct: ['user_id'],
    }),
    this.prisma.gameAttempt.groupBy({
      by: ['game_type'],
      where: attemptsWhere,
      _count: { _all: true },
      _avg: { score: true },
    }),
    this.prisma.gameAttempt.groupBy({
      by: ['game_type'],
      where: { ...attemptsWhere, is_correct: true },
      _count: { _all: true },
    }),
    this.prisma.gameAttempt.aggregate({
      where: attemptsWhere,
      _count: { _all: true },
      _avg: { score: true },
    }),
    this.prisma.gameAttempt.count({ where: { ...attemptsWhere, is_correct: true } }),
    this.prisma.gameAttempt.count({ where: { ...attemptsWhere, completed_quickly: true } }),
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

  const totalAttempts = overallAgg._count._all;
  const averageScore = overallAgg._avg.score ?? 0;

  const correctByType = new Map(
    byGameTypeCorrect.map((g) => [g.game_type, g._count._all]),
  );
  const byGameType: GameTypeBreakdown[] = byGameTypeTotal.map((g) => {
    const attempts = g._count._all;
    const correct = correctByType.get(g.game_type) ?? 0;
    return {
      gameType: g.game_type,
      attempts,
      successRate: attempts > 0 ? correct / attempts : 0,
      averageScore: g._avg.score ?? 0,
    };
  });

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
      successRate: totalAttempts > 0 ? correctCount / totalAttempts : 0,
      averageScore,
      quickCompletionRate: totalAttempts > 0 ? quickCount / totalAttempts : 0,
      byGameType,
    },
    contentProgress: {
      averageProgress: progressAgg._avg.progress ?? 0,
      completedCount: progressAgg._count._all,
      strugglingContent,
    },
  };
}
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

  async findReportsByTeacher(teacherId: string, limit = 12): Promise<TeacherInsightReport[]> {
    return this.prisma.teacherInsightReport.findMany({
      where: { teacher_id: teacherId },
      orderBy: { period_start: 'desc' },
      take: limit,
    });
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