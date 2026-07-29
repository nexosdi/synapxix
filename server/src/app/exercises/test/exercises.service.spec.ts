import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from '../exercises.service';
import { AiProvider } from '../../modules/research/providers/ai.provider';
import { EvaluateReadAloudDto } from '../dto/evaluate-read-aloud.dto';
import {
  createMockAudioFile,
  validReadAloudDto,
} from './fixtures/audio-file.fixtures';

describe('ExercisesService', () => {
  let service: ExercisesService;

  const mockAiProvider = {
    analyzeAudio: jest.fn(),
  };

  const dto: EvaluateReadAloudDto = { ...validReadAloudDto };
  const file = createMockAudioFile();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        { provide: AiProvider, useValue: mockAiProvider },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    jest.clearAllMocks();
  });

  describe('evaluateAudio', () => {
    it('should send base64 audio and mime type to AiProvider', async () => {
      mockAiProvider.analyzeAudio.mockResolvedValue(
        '{"isCorrect":true,"score":88,"feedback":"Well done"}',
      );

      await service.evaluateAudio(dto, file);

      expect(mockAiProvider.analyzeAudio).toHaveBeenCalledWith(
        dto.expectedText,
        file.mimetype,
        file.buffer.toString('base64'),
      );
    });

    it('should parse a clean JSON response from the AI provider', async () => {
      mockAiProvider.analyzeAudio.mockResolvedValue(
        '{"isCorrect":true,"score":88,"feedback":"Well done"}',
      );

      const result = await service.evaluateAudio(dto, file);

      expect(result).toEqual({
        isCorrect: true,
        score: 88,
        feedback: 'Well done',
      });
    });

    it('should parse JSON wrapped in markdown code fences', async () => {
      mockAiProvider.analyzeAudio.mockResolvedValue(
        '```json\n{"isCorrect":false,"score":40,"feedback":"Try again"}\n```',
      );

      const result = await service.evaluateAudio(dto, file);

      expect(result).toEqual({
        isCorrect: false,
        score: 40,
        feedback: 'Try again',
      });
    });

    it('should return a safe fallback when AI response is not valid JSON', async () => {
      mockAiProvider.analyzeAudio.mockResolvedValue('not-json');

      const result = await service.evaluateAudio(dto, file);

      expect(result).toEqual({
        isCorrect: false,
        score: 0,
        feedback: 'Could not parse AI response',
        rawResult: 'not-json',
      });
    });
  });
});
