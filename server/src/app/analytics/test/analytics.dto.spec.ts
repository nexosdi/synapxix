import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  GlobalCognitiveAverageDto,
  IndividualCognitiveAverageDto,
  ClassProgressDto,
  StudentProgressDto,
  GlobalMotorAverageDto,
  GlobalEvaluativeAverageDto,
} from '../dto';

describe('Analytics DTOs Validation', () => {
  describe('GlobalCognitiveAverageDto', () => {
    it('should validate a valid GlobalCognitiveAverageDto', async () => {
      const dto = plainToInstance(GlobalCognitiveAverageDto, {
        accuracy: 0.85,
        reaction_time: 1200,
        cognitive_load: 0.75,
        memory_retention: 0.9,
        attention_span: 0.8,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if accuracy is not a number', async () => {
      const dto = plainToInstance(GlobalCognitiveAverageDto, {
        accuracy: 'invalid',
        reaction_time: 1200,
        cognitive_load: 0.75,
        memory_retention: 0.9,
        attention_span: 0.8,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('accuracy');
    });
  });

  describe('IndividualCognitiveAverageDto', () => {
    it('should validate a valid IndividualCognitiveAverageDto', async () => {
      const dto = plainToInstance(IndividualCognitiveAverageDto, {
        user_id: 'user-uuid-123',
        accuracy: 0.85,
        reaction_time: 1200,
        cognitive_load: 0.75,
        memory_retention: 0.9,
        attention_span: 0.8,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if user_id is missing or not a string', async () => {
      const dto = plainToInstance(IndividualCognitiveAverageDto, {
        user_id: 12345,
        accuracy: 0.85,
        reaction_time: 1200,
        cognitive_load: 0.75,
        memory_retention: 0.9,
        attention_span: 0.8,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'user_id')).toBe(true);
    });
  });

  describe('ClassProgressDto', () => {
    it('should validate a valid ClassProgressDto', async () => {
      const dto = plainToInstance(ClassProgressDto, {
        class_id: 'class-uuid-456',
        progress: 0.75,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if progress is not a number', async () => {
      const dto = plainToInstance(ClassProgressDto, {
        class_id: 'class-uuid-456',
        progress: 'not-a-number',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('progress');
    });
  });

  describe('StudentProgressDto', () => {
    it('should validate a valid StudentProgressDto', async () => {
      const dto = plainToInstance(StudentProgressDto, {
        student_id: 'student-uuid-789',
        progress: 0.9,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if student_id is missing or invalid', async () => {
      const dto = plainToInstance(StudentProgressDto, {
        student_id: 999,
        progress: 0.9,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'student_id')).toBe(true);
    });
  });

  describe('GlobalMotorAverageDto', () => {
    it('should validate a valid GlobalMotorAverageDto', async () => {
      const dto = plainToInstance(GlobalMotorAverageDto, {
        average_score: 98.5,
        completed_quickly_rate: 0.7,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if average_score is not a number', async () => {
      const dto = plainToInstance(GlobalMotorAverageDto, {
        average_score: 'high',
        completed_quickly_rate: 0.7,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('average_score');
    });
  });

  describe('GlobalEvaluativeAverageDto', () => {
    it('should validate a valid GlobalEvaluativeAverageDto', async () => {
      const dto = plainToInstance(GlobalEvaluativeAverageDto, {
        success_rate: 0.92,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if success_rate is not a number', async () => {
      const dto = plainToInstance(GlobalEvaluativeAverageDto, {
        success_rate: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('success_rate');
    });
  });
});
