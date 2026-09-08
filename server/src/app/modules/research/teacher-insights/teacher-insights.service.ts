import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TeacherInsightReport } from '@prisma/client';
import { AiProvider } from '../providers/ai.provider';
import { AiPromptService } from '../services/ai-prompt.service';
import { TeacherInsightsRepository } from './teacher-insights.repository';

const DEFAULT_SYSTEM_PROMPT = `
You are an expert pedagogical AI assistant. You analyze a teacher's class
weekly performance metrics (accuracy, reaction time, cognitive load, game
results, and content progress) and write a report in Spanish that helps the
teacher understand where to focus their next lessons.
`;

@Injectable()
export class TeacherInsightsService {
  private readonly logger = new Logger(TeacherInsightsService.name);

  constructor(
    private readonly repository: TeacherInsightsRepository,
    private readonly aiProvider: AiProvider,
    private readonly aiPromptService: AiPromptService,
  ) {}

  async generateWeeklyReportsForAllTeachers(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<{ processed: number; failed: number }> {
    const teacherIds = await this.repository.findTeacherIdsWithStudents();
    this.logger.log(
      `Starting weekly insight generation for ${teacherIds.length} teacher(s) | period ${periodStart.toISOString()} -> ${periodEnd.toISOString()}`,
    );

    let processed = 0;
    let failed = 0;

    for (const teacherId of teacherIds) {
      try {
        await this.generateWeeklyReportForTeacher(teacherId, periodStart, periodEnd);
        processed += 1;
      } catch (error: any) {
        failed += 1;
        this.logger.error(
          `Failed to generate weekly report for teacher ${teacherId}: ${error.message}`,
        );
      }
    }

    this.logger.log(
      `Weekly insight generation finished. processed=${processed} failed=${failed}`,
    );

    return { processed, failed };
  }

  
  async generateWeeklyReportForTeacher(
    teacherId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<TeacherInsightReport> {
    const studentIds = await this.repository.findStudentIdsForTeacher(teacherId);

    if (studentIds.length === 0) {
      throw new NotFoundException(`Teacher ${teacherId} has no linked students`);
    }

    const metricsSummary = await this.repository.buildWeeklyMetricsSummary(
      teacherId,
      studentIds,
      periodStart,
      periodEnd,
    );

    const systemPrompt = await this.aiPromptService.getPrompt(
      'teacher-insights',
      'WEEKLY_REPORT',
      DEFAULT_SYSTEM_PROMPT,
    );

    const reportText = await this.aiProvider.analyzeTeacherWeeklyMetrics(
      systemPrompt,
      metricsSummary as unknown as Record<string, unknown>,
    );

    return this.repository.saveReport({
      teacherId,
      periodStart,
      periodEnd,
      studentCount: metricsSummary.studentCount,
      activeStudents: metricsSummary.activeStudents,
      metricsSummary,
      reportText,
    });
  }

  async getReportsForTeacher(teacherId: string, limit?: number): Promise<TeacherInsightReport[]> {
    return this.repository.findReportsByTeacher(teacherId, limit);
  }
}