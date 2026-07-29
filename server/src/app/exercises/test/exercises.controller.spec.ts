import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from '../exercises.controller';
import { ExercisesService } from '../exercises.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { EvaluateReadAloudDto } from '../dto/evaluate-read-aloud.dto';
import {
  createMockAudioFile,
  validReadAloudDto,
} from './fixtures/audio-file.fixtures';

describe('ExercisesController', () => {
  let controller: ExercisesController;
  let service: ExercisesService;

  const mockService = {
    evaluateAudio: jest.fn(),
  };

  const dto: EvaluateReadAloudDto = { ...validReadAloudDto };
  const file = createMockAudioFile();

  const evaluationResponse = {
    isCorrect: true,
    score: 92,
    feedback: 'Great pronunciation.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [{ provide: ExercisesService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ExercisesController>(ExercisesController);
    service = module.get<ExercisesService>(ExercisesService);
    jest.clearAllMocks();
  });

  describe('POST /exercises/read-aloud', () => {
    it('should delegate evaluation to ExercisesService with typed DTO and file', async () => {
      mockService.evaluateAudio.mockResolvedValue(evaluationResponse);

      const result = await controller.evaluateReadAloud(dto, file);

      expect(result).toEqual(evaluationResponse);
      expect(service.evaluateAudio).toHaveBeenCalledWith(dto, file);
    });

    it('should return the service response unchanged', async () => {
      mockService.evaluateAudio.mockResolvedValue(evaluationResponse);

      const result = await controller.evaluateReadAloud(dto, file);

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBe(92);
      expect(result.feedback).toBe('Great pronunciation.');
    });

    it('should propagate service errors', async () => {
      mockService.evaluateAudio.mockRejectedValue(new Error('AI provider unavailable'));

      await expect(controller.evaluateReadAloud(dto, file)).rejects.toThrow(
        'AI provider unavailable',
      );
    });
  });
});
