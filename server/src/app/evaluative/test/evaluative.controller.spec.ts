import { Test, TestingModule } from '@nestjs/testing';
import { EvaluativeController } from '../evaluative.controller';
import { EvaluativeService } from '../evaluative.service';
import { AiProvider } from '../../modules/research/providers/ai.provider';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TeacherAccessGuard } from '../../auth/teacher-access.guard';
import { Request } from 'express';
import { KeycloakJwtPayload } from '../../auth/jwt.strategy';
import {
  mockUserId,
  mockUserJwtPayload,
  mockEvaluateSessionDto,
  mockEvaluateAiInputDto,
  mockEvaluateAiAudioDto,
  mockCognitiveMetricResult,
} from './fixtures/evaluative.fixtures';

/**
 * Unit tests for the EvaluativeController.
 * Responsible for verifying endpoint protection, proper dependency delegation,
 * and routing between different AI evaluation strategies (semantic vs phonetic).
 */
describe('EvaluativeController', () => {
  let controller: EvaluativeController;
  let service: EvaluativeService;
  let aiProvider: AiProvider;

  const mockEvaluativeService = {
    evaluateAndPersist: jest.fn(),
    transformAiToMetricsAndPersist: jest.fn(),
    getStudentList: jest.fn(),
    getStudentDetail: jest.fn(),
  };

  const mockAiProvider = {
    analyzePedagogicalAction: jest.fn(),
    analyzeAudio: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluativeController],
      providers: [
        { provide: EvaluativeService, useValue: mockEvaluativeService },
        { provide: AiProvider, useValue: mockAiProvider },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TeacherAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EvaluativeController>(EvaluativeController);
    service = module.get<EvaluativeService>(EvaluativeService);
    aiProvider = module.get<AiProvider>(AiProvider);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Tests for the standard metric evaluation endpoint.
   */
  describe('POST /evaluative/evaluate', () => {
    it('should be protected by JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', EvaluativeController);
      expect(guards).toBeDefined();
      expect(guards[0]).toBe(JwtAuthGuard);
    });

    it('should delegate to EvaluativeService.evaluateAndPersist and return success envelope', async () => {
      mockEvaluativeService.evaluateAndPersist.mockResolvedValue(mockCognitiveMetricResult);

      const result = await controller.evaluateSession(mockUserId, mockEvaluateSessionDto);

      expect(result).toEqual({
        success: true,
        message: 'Cognitive metrics evaluated and persisted successfully',
        data: mockCognitiveMetricResult,
      });
      expect(service.evaluateAndPersist).toHaveBeenCalledWith({
        ...mockEvaluateSessionDto,
        userId: mockUserId,
      });
    });
  });

  /**
   * Tests for the AI-driven evaluation endpoint.
   * Verifies that the controller dispatches correctly based on payload contents.
   */
  describe('POST /evaluative/evaluate-ai', () => {
    it('should delegate to AiProvider.analyzePedagogicalAction for semantic evaluation', async () => {
      const aiResponse = '{"isCorrect": true, "score": 90}';
      mockAiProvider.analyzePedagogicalAction.mockResolvedValue(aiResponse);
      mockEvaluativeService.transformAiToMetricsAndPersist.mockResolvedValue(mockCognitiveMetricResult);

      const result = await controller.evaluateAiSession(mockUserId, mockEvaluateAiInputDto);

      expect(aiProvider.analyzePedagogicalAction).toHaveBeenCalledWith(
        'You are an AI teacher evaluating cognitive and semantic performance.',
        mockEvaluateAiInputDto.promptOrContext,
        mockEvaluateAiInputDto.studentTextResponse
      );
      expect(aiProvider.analyzeAudio).not.toHaveBeenCalled();
      expect(service.transformAiToMetricsAndPersist).toHaveBeenCalledWith(
        mockUserId,
        mockEvaluateAiInputDto.sessionId,
        aiResponse
      );
      expect(result.data).toEqual(mockCognitiveMetricResult);
    });

    it('should delegate to AiProvider.analyzeAudio for audio/phonetic evaluation', async () => {
      const aiResponse = '{"isCorrect": false, "score": 40}';
      mockAiProvider.analyzeAudio.mockResolvedValue(aiResponse);
      mockEvaluativeService.transformAiToMetricsAndPersist.mockResolvedValue(mockCognitiveMetricResult);

      const result = await controller.evaluateAiSession(mockUserId, mockEvaluateAiAudioDto);

      expect(aiProvider.analyzeAudio).toHaveBeenCalledWith(
        mockEvaluateAiAudioDto.expectedText,
        mockEvaluateAiAudioDto.audioMimeType,
        mockEvaluateAiAudioDto.audioBase64
      );
      expect(aiProvider.analyzePedagogicalAction).not.toHaveBeenCalled();
      expect(service.transformAiToMetricsAndPersist).toHaveBeenCalledWith(
        mockUserId,
        mockEvaluateAiAudioDto.sessionId,
        aiResponse
      );
      expect(result.data).toEqual(mockCognitiveMetricResult);
    });

    it('should propagate service errors as-is', async () => {
      mockAiProvider.analyzePedagogicalAction.mockRejectedValue(new Error('AI Provider Error'));

      await expect(controller.evaluateAiSession(mockUserId, mockEvaluateAiInputDto)).rejects.toThrow('AI Provider Error');
      expect(service.transformAiToMetricsAndPersist).not.toHaveBeenCalled();
    });
  });

  /**
   * Tests for the student metrics listing endpoint.
   */
  describe('GET /evaluative/students', () => {
    it('should delegate to EvaluativeService.getStudentList', async () => {
      const mockStudentList = [{ userId: mockUserId, displayName: 'Test Student' }];
      mockEvaluativeService.getStudentList.mockResolvedValue(mockStudentList);

      const req = { user: mockUserJwtPayload } as unknown as Request & { user: KeycloakJwtPayload };
      const result = await controller.getStudentList(req);

      expect(result).toEqual(mockStudentList);
      expect(service.getStudentList).toHaveBeenCalledWith(mockUserJwtPayload);
    });
  });

  /**
   * Tests for the individual student metrics detail endpoint.
   */
  describe('GET /evaluative/students/:id/metrics', () => {
    it('should delegate to EvaluativeService.getStudentDetail', async () => {
      const mockMetrics = [mockCognitiveMetricResult];
      mockEvaluativeService.getStudentDetail.mockResolvedValue(mockMetrics);

      const result = await controller.getStudentDetail(mockUserId);

      expect(result).toEqual(mockMetrics);
      expect(service.getStudentDetail).toHaveBeenCalledWith(mockUserId);
    });
  });
});
