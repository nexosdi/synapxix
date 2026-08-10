import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { TeacherInsightsController } from '../teacher-insights.controller';
import { TeacherInsightsService } from '../teacher-insights.service';

describe('TeacherInsightsController', () => {
  let controller: TeacherInsightsController;
  let service: jest.Mocked<TeacherInsightsService>;
  let prisma: jest.Mocked<PrismaService>;

  const mockTeacherId = '11111111-1111-1111-1111-111111111111';
  const mockOtherId = '99999999-9999-9999-9999-999999999999';

  const mockReport = {
    report_id: 'report-uuid',
    teacher_id: mockTeacherId,
    period_start: new Date('2026-08-01T00:00:00Z'),
    period_end: new Date('2026-08-08T00:00:00Z'),
    student_count: 5,
    active_students: 4,
    metrics_summary: {} as any,
    report_text: 'Report text',
    status: 'GENERATED',
    created_at: new Date('2026-08-08T03:00:00Z'),
  };

  beforeEach(async () => {
    const mockService = {
      getReportsForTeacher: jest.fn().mockResolvedValue([mockReport]),
      generateWeeklyReportForTeacher: jest.fn().mockResolvedValue(mockReport),
    };

    const mockPrisma = {
      app_user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherInsightsController],
      providers: [
        { provide: TeacherInsightsService, useValue: mockService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<TeacherInsightsController>(TeacherInsightsController);
    service = module.get(TeacherInsightsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReports', () => {
    it('should return mapped reports when authorized as self', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockTeacherId,
        role: 'teacher',
      });

      const req: any = { user: { sub: mockTeacherId } };

      const result = await controller.getReports(mockTeacherId, req, '5');

      expect(service.getReportsForTeacher).toHaveBeenCalledWith(mockTeacherId, 5);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        reportId: mockReport.report_id,
        teacherId: mockReport.teacher_id,
        periodStart: mockReport.period_start,
        periodEnd: mockReport.period_end,
        studentCount: mockReport.student_count,
        activeStudents: mockReport.active_students,
        reportText: mockReport.report_text,
        status: mockReport.status,
        createdAt: mockReport.created_at,
      });
    });

    it('should return mapped reports when authorized as admin for another teacher', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockOtherId,
        role: 'admin',
      });

      const req: any = { user: { sub: mockOtherId } };

      const result = await controller.getReports(mockTeacherId, req);

      expect(service.getReportsForTeacher).toHaveBeenCalledWith(mockTeacherId, undefined);
      expect(result).toHaveLength(1);
    });

    it('should throw UnauthorizedException when a teacher tries to access another teacher reports', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockOtherId,
        role: 'teacher',
      });

      const req: any = { user: { sub: mockOtherId } };

      await expect(controller.getReports(mockTeacherId, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when a student tries to access teacher reports', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockOtherId,
        role: 'student',
      });

      const req: any = { user: { sub: mockOtherId } };

      await expect(controller.getReports(mockTeacherId, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateNow', () => {
    it('should trigger manual generation when user is target teacher', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockTeacherId,
        role: 'teacher',
      });

      const req: any = { user: { sub: mockTeacherId } };

      const result = await controller.generateNow(mockTeacherId, req);

      expect(service.generateWeeklyReportForTeacher).toHaveBeenCalledWith(
        mockTeacherId,
        expect.any(Date),
        expect.any(Date),
      );
      expect(result.reportId).toBe(mockReport.report_id);
    });

    it('should throw UnauthorizedException when a teacher tries to generate report for another teacher', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockOtherId,
        role: 'teacher',
      });

      const req: any = { user: { sub: mockOtherId } };

      await expect(controller.generateNow(mockTeacherId, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should allow admin to trigger report for any teacher', async () => {
      (prisma.app_user.findUnique as jest.Mock).mockResolvedValue({
        user_id: mockOtherId,
        role: 'admin',
      });

      const req: any = { user: { sub: mockOtherId } };

      const result = await controller.generateNow(mockTeacherId, req);
      expect(result.reportId).toBe(mockReport.report_id);
    });
  });
});
