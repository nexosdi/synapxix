import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  EvaluateSessionDto,
  EvaluateAiInputDto,
  GameAttemptRecordDto,
} from '../dto/evaluate-session.dto';

/**
 * Unit tests for the Evaluative DTOs.
 * Ensures that class-validator decorators correctly reject malformed input
 * before it reaches the controller layer.
 */
describe('Evaluative DTOs Validation', () => {
  /**
   * Tests for the EvaluateSessionDto.
   * Validates the structure of standard session evaluation requests.
   */
  describe('EvaluateSessionDto', () => {
    it('should validate a valid EvaluateSessionDto', async () => {
      const dto = plainToInstance(EvaluateSessionDto, {
        sessionId: 'sess-123',
        attempts: [
          {
            contentId: 'c1',
            gameType: 'memory',
            isCorrect: true,
            score: 100,
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if sessionId is missing', async () => {
      const dto = plainToInstance(EvaluateSessionDto, {
        attempts: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'sessionId')).toBe(true);
    });

    it('should fail validation if sessionId is not a string', async () => {
      const dto = plainToInstance(EvaluateSessionDto, {
        sessionId: 12345,
        attempts: [],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'sessionId')).toBe(true);
    });

    it('should fail validation if attempts is missing', async () => {
      const dto = plainToInstance(EvaluateSessionDto, {
        sessionId: 'sess-123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'attempts')).toBe(true);
    });

    it('should fail validation if a nested attempt is invalid', async () => {
      const dto = plainToInstance(EvaluateSessionDto, {
        sessionId: 'sess-123',
        attempts: [
          {
            contentId: 'c1',
            gameType: 'memory',
            isCorrect: 'yes', // should be boolean
            score: 100,
          },
        ],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'attempts')).toBe(true);
      // Ensure the nested error is actually caught
      expect(errors[0].children?.[0]?.children?.some((e) => e.property === 'isCorrect')).toBe(true);
    });
  });

  /**
   * Tests for the GameAttemptRecordDto.
   * Validates individual attempt records, ensuring required fields are present
   * and optional fields (like reactionTimeMs) are handled gracefully.
   */
  describe('GameAttemptRecordDto', () => {
    it('should validate a valid GameAttemptRecordDto', async () => {
      const dto = plainToInstance(GameAttemptRecordDto, {
        contentId: 'c1',
        gameType: 'memory',
        isCorrect: true,
        score: 100,
        completedQuickly: true,
        reactionTimeMs: 1500,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a GameAttemptRecordDto without optional fields', async () => {
      const dto = plainToInstance(GameAttemptRecordDto, {
        contentId: 'c1',
        gameType: 'memory',
        isCorrect: true,
        score: 100,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  /**
   * Tests for the EvaluateAiInputDto.
   * Validates requests intended for AI-driven semantic or phonetic analysis.
   */
  describe('EvaluateAiInputDto', () => {
    it('should validate a valid semantic EvaluateAiInputDto', async () => {
      const dto = plainToInstance(EvaluateAiInputDto, {
        sessionId: 'sess-123',
        gameType: 'semantic',
        promptOrContext: 'Answer this question.',
        studentTextResponse: 'My answer',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a valid audio EvaluateAiInputDto', async () => {
      const dto = plainToInstance(EvaluateAiInputDto, {
        sessionId: 'sess-123',
        gameType: 'phonological',
        promptOrContext: 'Read aloud.',
        expectedText: 'Hello',
        audioMimeType: 'audio/webm',
        audioBase64: 'base64string',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if gameType is missing', async () => {
      const dto = plainToInstance(EvaluateAiInputDto, {
        sessionId: 'sess-123',
        promptOrContext: 'Answer this question.',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'gameType')).toBe(true);
    });
  });
});
