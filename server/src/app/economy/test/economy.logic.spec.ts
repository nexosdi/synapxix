import { calculateGameReward, calculateXP } from '../logic/economy.logic';

describe('EconomyLogic Unit Tests', () => {
  describe('calculateGameReward', () => {
    it('should award 115 credits for a victory with 150 points', () => {
      const result = calculateGameReward(true, 150);
      expect(result).toBe(115);
    });

    it('should award 25 credits for a loss with 50 points', () => {
      const result = calculateGameReward(false, 50);
      expect(result).toBe(25);
    });

    it('should award only the base participation credits when score is 0', () => {
      const result = calculateGameReward(false, 0);
      expect(result).toBe(20);
    });

    it('should award base victory credits when score is 0', () => {
      expect(calculateGameReward(true, 0)).toBe(100);
    });

    it('should not apply bonus for score below 10 (floor behavior)', () => {
      expect(calculateGameReward(true, 9)).toBe(100);
    });

    it('should apply bonus of +1 at score exactly 10', () => {
      expect(calculateGameReward(true, 10)).toBe(101);
    });

    it('should handle score at DTO maximum (1000) without exceeding threshold', () => {
      expect(calculateGameReward(true, 1000)).toBe(200);
    });

    it('should be deterministic for identical inputs', () => {
      expect(calculateGameReward(true, 350)).toBe(calculateGameReward(true, 350));
    });
  });

  describe('calculateXP', () => {
    it('should award 57 XP for a victory with 150 points', () => {
      const result = calculateXP(true, 150);
      expect(result).toBe(57);
    });

    it('should award 11 XP for a loss with 50 points', () => {
      const result = calculateXP(false, 50);
      expect(result).toBe(11);
    });

    it('should award only the base participation XP when score is 0', () => {
      const result = calculateXP(false, 0);
      expect(result).toBe(10);
    });

    it('should award base victory XP when score is 0', () => {
      expect(calculateXP(true, 0)).toBe(50);
    });

    it('should not apply bonus for score below 20 (victory)', () => {
      expect(calculateXP(true, 19)).toBe(50);
    });

    it('should apply +1 bonus at score exactly 20 (victory)', () => {
      expect(calculateXP(true, 20)).toBe(51);
    });

    it('should not apply bonus for score below 50 (participation)', () => {
      expect(calculateXP(false, 49)).toBe(10);
    });

    it('should apply +1 bonus at score exactly 50 (participation)', () => {
      expect(calculateXP(false, 50)).toBe(11);
    });

    it('should handle max score (1000) safely', () => {
      expect(calculateXP(true, 1000)).toBe(100);
      expect(calculateXP(false, 1000)).toBe(30);
    });

    it('should be deterministic for identical inputs', () => {
      expect(calculateXP(true, 350)).toBe(calculateXP(true, 350));
    });
  });
});