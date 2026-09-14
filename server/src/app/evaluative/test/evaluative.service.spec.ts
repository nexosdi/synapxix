import { Test, TestingModule } from '@nestjs/testing';
import { EvaluativeService } from '../evaluative.service';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import {
  mockUserId,
  mockSessionId,
  mockValidAttempts,
  mockEvaluateSessionDto,
  mockGameSession,
} from './fixtures/evaluative.fixtures';

/**
 * Unit tests for the EvaluativeService.
 * Focuses on verifying the accuracy of cognitive metric calculations,
 * the correct handling of database transactions (Prisma), 
 * and the parsing logic for AI-generated text/JSON responses.
 */
describe('EvaluativeService', () => {
  let service: EvaluativeService;

  // Simulate a Prisma transaction context
  const mockTx = {
    gameSession: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    cognitiveMetric: {
      create: jest.fn(),
    },
  };

  const mockPrismaService = {
    $transaction: jest.fn(async (callback) => {
      return callback(mockTx);
    }),
    app_user: {
      findMany: jest.fn(),
    },
    cognitiveMetric: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluativeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EvaluativeService>(EvaluativeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests for the core evaluation method.
   * Verifies mathematical metric derivation from a set of attempts 
   * and ensures the Prisma transaction handles session updates and metric creation correctly.
   */
  describe('evaluateAndPersist', () => {
    it('should calculate metrics correctly and persist via transaction', async () => {
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);
      mockTx.cognitiveMetric.create.mockResolvedValue({ metric_id: '123' });

      await service.evaluateAndPersist({ ...mockEvaluateSessionDto, userId: mockUserId });

      // Verify transaction was called
      expect(mockPrismaService.$transaction).toHaveBeenCalled();

      // Verify metrics calculation
      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          session_id: mockSessionId,
          user_id: mockUserId,
          accuracy: 2 / 3, // 2 correct out of 3
          // reaction_time: (1200 + 3500 + 1500) / 3 = 2066.666...
          reaction_time: expect.closeTo(2066.67, 1),
          // memoryRetention: 1 correct out of 1 repeated content
          memory_retention: 1,
          // cognitiveLoad: (1 - 0.666...) * 50 + (2066.666... / 1000) * 10 = 16.666... + 20.666... = 37.333...
          cognitive_load: expect.closeTo(37.33, 1),
        }),
      });
    });

    it('should mark session as completed when status is not completed', async () => {
      mockTx.gameSession.findUnique.mockResolvedValue({ ...mockGameSession, status: 'in_progress' });
      
      await service.evaluateAndPersist({ ...mockEvaluateSessionDto, userId: mockUserId });

      expect(mockTx.gameSession.update).toHaveBeenCalledWith({
        where: { session_id: mockSessionId },
        data: { status: 'completed', finished_at: expect.any(Date) },
      });
    });

    it('should NOT update session when already completed', async () => {
      mockTx.gameSession.findUnique.mockResolvedValue({ ...mockGameSession, status: 'completed' });
      
      await service.evaluateAndPersist({ ...mockEvaluateSessionDto, userId: mockUserId });

      expect(mockTx.gameSession.update).not.toHaveBeenCalled();
    });

    it('should handle empty attempts array with zero metrics', async () => {
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);

      await service.evaluateAndPersist({ sessionId: mockSessionId, attempts: [], userId: mockUserId });

      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accuracy: 0,
          reaction_time: 0,
          cognitive_load: 0,
          memory_retention: 0,
          attention_span: 0,
        }),
      });
    });

    it('should handle session not found (null) without update attempt', async () => {
      mockTx.gameSession.findUnique.mockResolvedValue(null);

      await service.evaluateAndPersist({ ...mockEvaluateSessionDto, userId: mockUserId });

      expect(mockTx.gameSession.update).not.toHaveBeenCalled();
      expect(mockTx.cognitiveMetric.create).toHaveBeenCalled(); // still creates metrics
    });
  });

  /**
   * Tests for transforming AI responses into standard metrics.
   * Verifies parsing logic for both structured JSON and unstructured text with heuristic fallbacks.
   */
  describe('transformAiToMetricsAndPersist', () => {
    it('should parse structured JSON from AI and derive accuracy', async () => {
      const aiResponse = '{"isCorrect": true, "score": 85}';
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);

      await service.transformAiToMetricsAndPersist(mockUserId, mockSessionId, aiResponse);

      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accuracy: 0.85,
          cognitive_load: (1 - 0.85) * 100, // 15
        }),
      });
    });

    it('should fallback to text heuristic when AI returns unstructured text with "excellent"', async () => {
      const aiResponse = 'The student did an excellent job.';
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);

      await service.transformAiToMetricsAndPersist(mockUserId, mockSessionId, aiResponse);

      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accuracy: 0.9,
          cognitive_load: 20,
        }),
      });
    });

    it('should fallback to text heuristic for negative keywords like "weakness"', async () => {
      const aiResponse = 'This area shows a significant weakness.';
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);

      await service.transformAiToMetricsAndPersist(mockUserId, mockSessionId, aiResponse);

      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accuracy: 0.3,
          cognitive_load: 80,
        }),
      });
    });

    it('should use default metrics when AI text matches no keyword', async () => {
      const aiResponse = 'Here is a neutral observation about the session.';
      mockTx.gameSession.findUnique.mockResolvedValue(mockGameSession);

      await service.transformAiToMetricsAndPersist(mockUserId, mockSessionId, aiResponse);

      expect(mockTx.cognitiveMetric.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accuracy: 0.5,
          cognitive_load: 50,
        }),
      });
    });
  });

  /**
   * Tests for student list aggregation.
   * Verifies that the service accurately merges user data with aggregated metrics.
   */
  describe('getStudentList', () => {
    it('should aggregate metrics per student and return formatted list', async () => {
      const mockStudents = [
        { user_id: 'u1', firstname: 'John', lastname: 'Doe', username: 'jdoe', created_at: new Date('2026-01-01') },
        { user_id: 'u2', firstname: '', lastname: '', username: 'janed', created_at: new Date('2026-01-02') },
      ];
      const mockAggregations = [
        {
          user_id: 'u1',
          _count: { session_id: 5 },
          _avg: { accuracy: 0.8, cognitive_load: 30 },
          _max: { created_at: new Date('2026-09-01') },
        }
      ];

      mockPrismaService.app_user.findMany.mockResolvedValue(mockStudents);
      mockPrismaService.cognitiveMetric.groupBy.mockResolvedValue(mockAggregations);

      const result = await service.getStudentList();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        userId: 'u1',
        displayName: 'John Doe',
        totalSessions: 5,
        avgAccuracy: 0.8,
        avgCognitiveLoad: 30,
        lastActive: new Date('2026-09-01').toISOString(),
      });
      expect(result[1]).toEqual({
        userId: 'u2',
        displayName: 'janed', // fallback to username
        totalSessions: 0,
        avgAccuracy: 0,
        avgCognitiveLoad: 0,
        lastActive: new Date('2026-01-02').toISOString(),
      });
    });
  });

  /**
   * Tests for retrieving an individual student's metric history.
   * Ensures the service maps the Prisma models correctly to the expected DTO shape.
   */
  describe('getStudentDetail', () => {
    it('should return formatted metrics history for a user', async () => {
      const mockMetrics = [
        {
          metric_id: 'm1',
          session_id: 's1',
          user_id: mockUserId,
          accuracy: 0.9,
          reaction_time: 1500,
          cognitive_load: 25,
          memory_retention: 0.8,
          attention_span: 0.9,
          created_at: new Date('2026-09-01T12:00:00Z'),
        }
      ];
      mockPrismaService.cognitiveMetric.findMany.mockResolvedValue(mockMetrics);

      const result = await service.getStudentDetail(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'm1',
        sessionId: 's1',
        userId: mockUserId,
        accuracy: 0.9,
        reactionTime: 1500,
        cognitiveLoad: 25,
        memoryRetention: 0.8,
        attentionSpan: 0.9,
        createdAt: '2026-09-01T12:00:00.000Z',
      });
      expect(mockPrismaService.cognitiveMetric.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        orderBy: { created_at: 'asc' },
      });
    });
  });
});
