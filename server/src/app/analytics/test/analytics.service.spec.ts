import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../analytics.service';
import { PrismaService } from '@nexosdi.synapxix/prisma';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    cognitiveMetric: {
      aggregate: jest.fn(),
    },
    userContentProgress: {
      aggregate: jest.fn(),
    },
    gameAttempt: {
      aggregate: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGlobalCognitiveAverage', () => {
    it('should query cognitive metrics with 30-day default filter when no dates are provided', async () => {
      mockPrismaService.cognitiveMetric.aggregate.mockResolvedValue({
        _avg: {
          accuracy: 0.85,
          reaction_time: 1200,
          cognitive_load: 0.75,
          memory_retention: 0.9,
          attention_span: 0.8,
        },
      });

      const result = await service.getGlobalCognitiveAverage();

      expect(result).toEqual({
        accuracy: 0.85,
        reaction_time: 1200,
        cognitive_load: 0.75,
        memory_retention: 0.9,
        attention_span: 0.8,
      });

      expect(mockPrismaService.cognitiveMetric.aggregate).toHaveBeenCalledTimes(1);
      const callArgs = mockPrismaService.cognitiveMetric.aggregate.mock.calls[0][0];
      expect(callArgs.where.created_at.gte).toBeInstanceOf(Date);
    });

    it('should query cognitive metrics with custom startDate and endDate', async () => {
      mockPrismaService.cognitiveMetric.aggregate.mockResolvedValue({
        _avg: {
          accuracy: 0.9,
          reaction_time: 1000,
          cognitive_load: 0.6,
          memory_retention: 0.95,
          attention_span: 0.85,
        },
      });

      const startDate = '2026-01-01';
      const endDate = '2026-01-31';
      const result = await service.getGlobalCognitiveAverage(startDate, endDate);

      expect(result.accuracy).toBe(0.9);
      expect(mockPrismaService.cognitiveMetric.aggregate).toHaveBeenCalledTimes(1);
      const callArgs = mockPrismaService.cognitiveMetric.aggregate.mock.calls[0][0];
      expect(callArgs.where.created_at.gte).toEqual(new Date(startDate));
      expect(callArgs.where.created_at.lte.getUTCHours()).toBe(23);
      expect(callArgs.where.created_at.lte.getUTCMinutes()).toBe(59);
    });

    it('should fallback to 0 when Prisma aggregate returns null values', async () => {
      mockPrismaService.cognitiveMetric.aggregate.mockResolvedValue({
        _avg: {
          accuracy: null,
          reaction_time: null,
          cognitive_load: null,
          memory_retention: null,
          attention_span: null,
        },
      });

      const result = await service.getGlobalCognitiveAverage();

      expect(result).toEqual({
        accuracy: 0,
        reaction_time: 0,
        cognitive_load: 0,
        memory_retention: 0,
        attention_span: 0,
      });
    });
  });

  describe('getIndividualCognitiveAverage', () => {
    it('should calculate cognitive metrics for a specific user ID', async () => {
      const userId = 'user-123';
      mockPrismaService.cognitiveMetric.aggregate.mockResolvedValue({
        _avg: {
          accuracy: 0.88,
          reaction_time: 1100,
          cognitive_load: 0.7,
          memory_retention: 0.92,
          attention_span: 0.84,
        },
      });

      const result = await service.getIndividualCognitiveAverage(userId);

      expect(result).toEqual({
        user_id: userId,
        accuracy: 0.88,
        reaction_time: 1100,
        cognitive_load: 0.7,
        memory_retention: 0.92,
        attention_span: 0.84,
      });

      expect(mockPrismaService.cognitiveMetric.aggregate).toHaveBeenCalledWith({
        _avg: {
          accuracy: true,
          reaction_time: true,
          cognitive_load: true,
          memory_retention: true,
          attention_span: true,
        },
        where: {
          user_id: userId,
        },
      });
    });

    it('should return 0 defaults when user has no metrics recorded', async () => {
      const userId = 'user-empty';
      mockPrismaService.cognitiveMetric.aggregate.mockResolvedValue({
        _avg: {
          accuracy: null,
          reaction_time: null,
          cognitive_load: null,
          memory_retention: null,
          attention_span: null,
        },
      });

      const result = await service.getIndividualCognitiveAverage(userId);

      expect(result).toEqual({
        user_id: userId,
        accuracy: 0,
        reaction_time: 0,
        cognitive_load: 0,
        memory_retention: 0,
        attention_span: 0,
      });
    });
  });

  describe('getClassProgress', () => {
    it('should calculate average progress for a class structure ID', async () => {
      const classId = 'class-789';
      mockPrismaService.userContentProgress.aggregate.mockResolvedValue({
        _avg: {
          progress: 0.75,
        },
      });

      const result = await service.getClassProgress(classId);

      expect(result).toEqual({
        class_id: classId,
        progress: 0.75,
      });

      expect(mockPrismaService.userContentProgress.aggregate).toHaveBeenCalledWith({
        _avg: {
          progress: true,
        },
        where: {
          user: {
            userStructures: {
              some: {
                structure_id: classId,
              },
            },
          },
        },
      });
    });

    it('should return progress 0 when aggregate is null', async () => {
      const classId = 'empty-class';
      mockPrismaService.userContentProgress.aggregate.mockResolvedValue({
        _avg: {
          progress: null,
        },
      });

      const result = await service.getClassProgress(classId);

      expect(result).toEqual({
        class_id: classId,
        progress: 0,
      });
    });
  });

  describe('getStudentProgress', () => {
    it('should calculate average progress for a student ID', async () => {
      const studentId = 'student-456';
      mockPrismaService.userContentProgress.aggregate.mockResolvedValue({
        _avg: {
          progress: 0.92,
        },
      });

      const result = await service.getStudentProgress(studentId);

      expect(result).toEqual({
        student_id: studentId,
        progress: 0.92,
      });

      expect(mockPrismaService.userContentProgress.aggregate).toHaveBeenCalledWith({
        _avg: {
          progress: true,
        },
        where: {
          user_id: studentId,
        },
      });
    });

    it('should return progress 0 when student has no content progress records', async () => {
      const studentId = 'new-student';
      mockPrismaService.userContentProgress.aggregate.mockResolvedValue({
        _avg: {
          progress: null,
        },
      });

      const result = await service.getStudentProgress(studentId);

      expect(result).toEqual({
        student_id: studentId,
        progress: 0,
      });
    });
  });

  describe('getGlobalMotorAverage', () => {
    it('should return calculated average score and completed_quickly_rate when attempts exist', async () => {
      mockPrismaService.gameAttempt.aggregate.mockResolvedValue({
        _avg: {
          score: 85.5,
        },
      });
      mockPrismaService.gameAttempt.count
        .mockResolvedValueOnce(6) // quickCompletions
        .mockResolvedValueOnce(10); // totalAttempts

      const result = await service.getGlobalMotorAverage();

      expect(result).toEqual({
        average_score: 85.5,
        completed_quickly_rate: 0.6,
      });
    });

    it('should handle zero total attempts without division by zero errors', async () => {
      mockPrismaService.gameAttempt.aggregate.mockResolvedValue({
        _avg: {
          score: null,
        },
      });
      mockPrismaService.gameAttempt.count
        .mockResolvedValueOnce(0) // quickCompletions
        .mockResolvedValueOnce(0); // totalAttempts

      const result = await service.getGlobalMotorAverage();

      expect(result).toEqual({
        average_score: 0,
        completed_quickly_rate: 0,
      });
    });
  });

  describe('getGlobalEvaluativeAverage', () => {
    it('should return calculated success rate when attempts exist', async () => {
      mockPrismaService.gameAttempt.count
        .mockResolvedValueOnce(18) // correctAttempts
        .mockResolvedValueOnce(20); // totalAttempts

      const result = await service.getGlobalEvaluativeAverage();

      expect(result).toEqual({
        success_rate: 0.9,
      });
    });

    it('should handle zero total attempts returning success_rate 0', async () => {
      mockPrismaService.gameAttempt.count
        .mockResolvedValueOnce(0) // correctAttempts
        .mockResolvedValueOnce(0); // totalAttempts

      const result = await service.getGlobalEvaluativeAverage();

      expect(result).toEqual({
        success_rate: 0,
      });
    });
  });
});
