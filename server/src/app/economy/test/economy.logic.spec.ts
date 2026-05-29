import { calculateGameReward } from '../logic/economy.logic';

describe('EconomyLogic Unit Tests', () => {
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
});