import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { linkType } from '@prisma/client';
import { TeacherInsightsRepository } from '../teacher-insights.repository';

describe('TeacherInsightsRepository', () => {
  let repository: TeacherInsightsRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockTeacherId = '11111111-1111-1111-1111-111111111111';
  const mockStudentId = '22222222-2222-2222-2222-222222222222';
  const mockPeriodStart = new Date('2026-08-01T00:00:00Z');
  const mockPeriodEnd = new Date('2026-08-08T00:00:00Z');

  beforeEach(async () => {
    const mockPrismaService = {
      userLink: {
        findMany: jest.fn(),
      },
      cognitiveMetric: {
        aggregate: jest.fn(),
      },
      gameSession: {
        findMany: jest.fn(),
      },
      gameAttempt: {
        findMany: jest.fn(),
      },
      userContentProgress: {
        aggregate: jest.fn(),
        groupBy: jest.fn(),
      },
      content: {
        findMany: jest.fn(),
      },
      teacherInsightReport: {
        upsert: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherInsightsRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<TeacherInsightsRepository>(TeacherInsightsRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findTeacherIdsWithStudents', () => {
    it('should query userLink for distinct id_user_from where link_type is TEACHER', async () => {
      (prisma.userLink.findMany as jest.Mock).mockResolvedValue([
        { id_user_from: mockTeacherId },
      ]);

      const result = await repository.findTeacherIdsWithStudents();

      expect(prisma.userLink.findMany).toHaveBeenCalledWith({
        where: {
          link_type: linkType.TEACHER,
          id_user_from: { not: null },
          id_user_to: { not: null },
        },
        select: { id_user_from: true },
        distinct: ['id_user_from'],
      });
      expect(result).toEqual([mockTeacherId]);
    });
  });

  describe('findStudentIdsForTeacher', () => {
    it('should query userLink for id_user_to linked to teacherId', async () => {
      (prisma.userLink.findMany as jest.Mock).mockResolvedValue([
        { id_user_to: mockStudentId },
      ]);

      const result = await repository.findStudentIdsForTeacher(mockTeacherId);

      expect(prisma.userLink.findMany).toHaveBeenCalledWith({
        where: {
          link_type: linkType.TEACHER,
          id_user_from: mockTeacherId,
          id_user_to: { not: null },
        },
        select: { id_user_to: true },
      });
      expect(result).toEqual([mockStudentId]);
    });
  });

  describe('buildWeeklyMetricsSummary', () => {
    it('should aggregate cognitive metrics, game attempts, and content progress', async () => {
      (prisma.cognitiveMetric.aggregate as jest.Mock).mockResolvedValue({
        _avg: {
          accuracy: 0.9,
          reaction_time: 1100,
          cognitive_load: 0.3,
          memory_retention: 0.85,
          attention_span: 0.75,
        },
      });

      (prisma.gameSession.findMany as jest.Mock).mockResolvedValue([{ user_id: mockStudentId }]);

      (prisma.gameAttempt.findMany as jest.Mock).mockResolvedValue([
        { game_type: 'MATH', is_correct: true, score: 100, completed_quickly: true },
        { game_type: 'MATH', is_correct: false, score: 50, completed_quickly: false },
      ]);

      (prisma.userContentProgress.aggregate as jest.Mock).mockResolvedValue({
        _avg: { progress: 0.8 },
        _count: { _all: 2 },
      });

      (prisma.userContentProgress.groupBy as jest.Mock).mockResolvedValue([
        { content_id: 'c1', _avg: { progress: 0.4 } },
      ]);

      (prisma.content.findMany as jest.Mock).mockResolvedValue([
        { content_id: 'c1', title: 'Fraction Basics' },
      ]);

      const summary = await repository.buildWeeklyMetricsSummary(
        mockTeacherId,
        [mockStudentId],
        mockPeriodStart,
        mockPeriodEnd,
      );

      expect(summary.teacherId).toBe(mockTeacherId);
      expect(summary.studentCount).toBe(1);
      expect(summary.activeStudents).toBe(1);
      expect(summary.cognitive.accuracy).toBe(0.9);
      expect(summary.gameAttempts.totalAttempts).toBe(2);
      expect(summary.gameAttempts.successRate).toBe(0.5);
      expect(summary.gameAttempts.averageScore).toBe(75);
      expect(summary.contentProgress.strugglingContent).toEqual([
        { contentId: 'c1', title: 'Fraction Basics', averageProgress: 0.4 },
      ]);
    });
  });

  describe('saveReport', () => {
    it('should upsert report into teacherInsightReport', async () => {
      const mockSavedReport = {
        report_id: 'rep-1',
        teacher_id: mockTeacherId,
        period_start: mockPeriodStart,
        period_end: mockPeriodEnd,
        student_count: 1,
        active_students: 1,
        metrics_summary: {},
        report_text: 'Summary text',
        status: 'GENERATED',
        created_at: new Date(),
      };

      (prisma.teacherInsightReport.upsert as jest.Mock).mockResolvedValue(mockSavedReport);

      const result = await repository.saveReport({
        teacherId: mockTeacherId,
        periodStart: mockPeriodStart,
        periodEnd: mockPeriodEnd,
        studentCount: 1,
        activeStudents: 1,
        metricsSummary: {} as any,
        reportText: 'Summary text',
      });

      expect(prisma.teacherInsightReport.upsert).toHaveBeenCalledWith({
        where: {
          teacher_id_period_start_period_end: {
            teacher_id: mockTeacherId,
            period_start: mockPeriodStart,
            period_end: mockPeriodEnd,
          },
        },
        update: expect.objectContaining({ report_text: 'Summary text', status: 'GENERATED' }),
        create: expect.objectContaining({ teacher_id: mockTeacherId, report_text: 'Summary text' }),
      });
      expect(result).toEqual(mockSavedReport);
    });
  });

  describe('findReportsByTeacher', () => {
    it('should query teacherInsightReport by teacher_id with order and limit', async () => {
      (prisma.teacherInsightReport.findMany as jest.Mock).mockResolvedValue([]);

      await repository.findReportsByTeacher(mockTeacherId, 10);

      expect(prisma.teacherInsightReport.findMany).toHaveBeenCalledWith({
        where: { teacher_id: mockTeacherId },
        orderBy: { period_start: 'desc' },
        take: 10,
      });
    });
  });
});
