import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from '../analytics.controller';
import { AnalyticsService } from '../analytics.service';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import {
  mockUserId,
  mockTargetUserId,
  mockClassId,
  mockUserJwtPayload,
  mockTeacherJwtPayload,
  mockGlobalCognitiveAverageResponse,
  mockIndividualCognitiveAverageResponse,
  mockClassProgressResponse,
  mockStudentProgressResponse,
  mockGlobalMotorAverageResponse,
  mockGlobalEvaluativeAverageResponse,
} from './fixtures/analytics.fixtures';
import { Request } from 'express';
import { KeycloakJwtPayload } from '../../auth/jwt.strategy';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getGlobalCognitiveAverage: jest.fn(),
    getIndividualCognitiveAverage: jest.fn(),
    getClassProgress: jest.fn(),
    getStudentProgress: jest.fn(),
    getGlobalMotorAverage: jest.fn(),
    getGlobalEvaluativeAverage: jest.fn(),
  };

  const mockPrismaService = {
    app_user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /analytics/global-average', () => {
    it('should delegate to AnalyticsService with optional date query parameters', async () => {
      mockAnalyticsService.getGlobalCognitiveAverage.mockResolvedValue(
        mockGlobalCognitiveAverageResponse,
      );

      const startDate = '2026-01-01';
      const endDate = '2026-01-31';

      const result = await controller.getGlobalCognitiveAverage(
        startDate,
        endDate,
      );

      expect(result).toEqual(mockGlobalCognitiveAverageResponse);
      expect(service.getGlobalCognitiveAverage).toHaveBeenCalledWith(
        startDate,
        endDate,
      );
    });
  });

  describe('GET /analytics/individual-average/:userId', () => {
    it('should allow user to access their own cognitive average without querying DB role', async () => {
      mockAnalyticsService.getIndividualCognitiveAverage.mockResolvedValue(
        mockIndividualCognitiveAverageResponse,
      );

      const req = { user: mockUserJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      const result = await controller.getIndividualCognitiveAverage(
        mockUserId,
        req,
      );

      expect(result).toEqual(mockIndividualCognitiveAverageResponse);
      expect(mockPrismaService.app_user.findUnique).not.toHaveBeenCalled();
      expect(service.getIndividualCognitiveAverage).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should allow a teacher or admin to access another user cognitive average', async () => {
      mockAnalyticsService.getIndividualCognitiveAverage.mockResolvedValue(
        mockIndividualCognitiveAverageResponse,
      );
      mockPrismaService.app_user.findUnique.mockResolvedValue({
        user_id: mockUserId,
        role: 'teacher',
      });

      const req = { user: mockTeacherJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      const result = await controller.getIndividualCognitiveAverage(
        mockTargetUserId,
        req,
      );

      expect(result).toEqual(mockIndividualCognitiveAverageResponse);
      expect(mockPrismaService.app_user.findUnique).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
      });
      expect(service.getIndividualCognitiveAverage).toHaveBeenCalledWith(
        mockTargetUserId,
      );
    });

    it('should throw UnauthorizedException when a regular user accesses another user cognitive average', async () => {
      mockPrismaService.app_user.findUnique.mockResolvedValue({
        user_id: mockUserId,
        role: 'user',
      });

      const req = { user: mockUserJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      await expect(
        controller.getIndividualCognitiveAverage(mockTargetUserId, req),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when req.user is missing or invalid', async () => {
      const req = {} as Request & { user: KeycloakJwtPayload };

      await expect(
        controller.getIndividualCognitiveAverage(mockUserId, req),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('GET /analytics/class-progress/:classId', () => {
    it('should delegate to AnalyticsService with classId parameter', async () => {
      mockAnalyticsService.getClassProgress.mockResolvedValue(
        mockClassProgressResponse,
      );

      const result = await controller.getClassProgress(mockClassId);

      expect(result).toEqual(mockClassProgressResponse);
      expect(service.getClassProgress).toHaveBeenCalledWith(mockClassId);
    });
  });

  describe('GET /analytics/student-progress/:studentId', () => {
    it('should allow student to access their own progress', async () => {
      mockAnalyticsService.getStudentProgress.mockResolvedValue(
        mockStudentProgressResponse,
      );

      const req = { user: mockUserJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      const result = await controller.getStudentProgress(mockUserId, req);

      expect(result).toEqual(mockStudentProgressResponse);
      expect(mockPrismaService.app_user.findUnique).not.toHaveBeenCalled();
      expect(service.getStudentProgress).toHaveBeenCalledWith(mockUserId);
    });

    it('should allow a teacher or admin to access student progress', async () => {
      mockAnalyticsService.getStudentProgress.mockResolvedValue(
        mockStudentProgressResponse,
      );
      mockPrismaService.app_user.findUnique.mockResolvedValue({
        user_id: mockUserId,
        role: 'admin',
      });

      const req = { user: mockTeacherJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      const result = await controller.getStudentProgress(
        mockTargetUserId,
        req,
      );

      expect(result).toEqual(mockStudentProgressResponse);
      expect(service.getStudentProgress).toHaveBeenCalledWith(
        mockTargetUserId,
      );
    });

    it('should throw UnauthorizedException when a non-teacher/admin requests another student progress', async () => {
      mockPrismaService.app_user.findUnique.mockResolvedValue({
        user_id: mockUserId,
        role: 'user',
      });

      const req = { user: mockUserJwtPayload } as Request & {
        user: KeycloakJwtPayload;
      };

      await expect(
        controller.getStudentProgress(mockTargetUserId, req),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token user is missing', async () => {
      const req = {} as Request & { user: KeycloakJwtPayload };

      await expect(
        controller.getStudentProgress(mockUserId, req),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('GET /analytics/global-motor-average', () => {
    it('should delegate to AnalyticsService and return global motor average', async () => {
      mockAnalyticsService.getGlobalMotorAverage.mockResolvedValue(
        mockGlobalMotorAverageResponse,
      );

      const result = await controller.getGlobalMotorAverage();

      expect(result).toEqual(mockGlobalMotorAverageResponse);
      expect(service.getGlobalMotorAverage).toHaveBeenCalled();
    });
  });

  describe('GET /analytics/global-evaluative-average', () => {
    it('should delegate to AnalyticsService and return global evaluative average', async () => {
      mockAnalyticsService.getGlobalEvaluativeAverage.mockResolvedValue(
        mockGlobalEvaluativeAverageResponse,
      );

      const result = await controller.getGlobalEvaluativeAverage();

      expect(result).toEqual(mockGlobalEvaluativeAverageResponse);
      expect(service.getGlobalEvaluativeAverage).toHaveBeenCalled();
    });
  });
});
