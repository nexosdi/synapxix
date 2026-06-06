import { Test, TestingModule } from '@nestjs/testing';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';
import { ConflictException } from '@nestjs/common';

describe('EconomyService — Stress & Concurrency', () => {
  let service: EconomyService;
  let repository: EconomyRepository;

  const mockRepository = {
    findTransactionBySessionId: jest.fn(),
    createRewardTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomyService,
        { provide: EconomyRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<EconomyService>(EconomyService);
    repository = module.get<EconomyRepository>(EconomyRepository);
    jest.clearAllMocks();
  });

  describe('Concurrent Claims — Same Session', () => {
    it('should allow only 1 of 10 concurrent claims to succeed for same session', async () => {
      const sessionId = 'concurrent-session-1';

      mockRepository.findTransactionBySessionId.mockResolvedValueOnce(null);
      mockRepository.createRewardTransaction.mockResolvedValueOnce({
        transactionId: 'tx-first',
        balance: 100,
      });

      mockRepository.findTransactionBySessionId.mockResolvedValue({
        id: 'exists',
      });

      const dto = { gameSessionId: sessionId, score: 100, victory: true };

      const promises = Array.from({ length: 10 }, (_, i) =>
        service
          .processGameReward(`user-${i}`, dto)
          .then(() => ({ success: true }))
          .catch((err) => {
            if (err instanceof ConflictException) {
              return { success: false, reason: 'conflict' };
            }
            throw err;
          })
      );

      const results = await Promise.all(promises);

      const successCount = results.filter((r) => r.success).length;
      const conflictCount = results.filter(
        (r): r is { success: false; reason: 'conflict' } =>
          !r.success && 'reason' in r && r.reason === 'conflict'
      ).length;

      expect(successCount).toBe(1);
      expect(conflictCount).toBe(9);
      expect(mockRepository.createRewardTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Burst Different Sessions', () => {
    it('should handle 100 requests for different sessions without errors', async () => {
      mockRepository.findTransactionBySessionId.mockResolvedValue(null);
      mockRepository.createRewardTransaction.mockImplementation(() =>
        Promise.resolve({
          transactionId: `tx-${Math.random()}`,
          balance: 100,
        })
      );

      const promises = Array.from({ length: 100 }, (_, i) =>
        service.processGameReward(`user-${i}`, {
          gameSessionId: `session-${i}`,
          score: Math.floor(Math.random() * 1000),
          victory: Math.random() > 0.5,
        })
      );

      const results = await Promise.allSettled(promises);
      const fulfilled = results.filter((r) => r.status === 'fulfilled');
      expect(fulfilled).toHaveLength(100);
    });
  });

  describe('Edge Case Storm', () => {
    it('should handle boundary scores (0 and 1000) in rapid succession', async () => {
      mockRepository.findTransactionBySessionId.mockResolvedValue(null);
      mockRepository.createRewardTransaction.mockResolvedValue({
        transactionId: 'tx-boundary',
        balance: 100,
      });

      const dto0 = {
        gameSessionId: 'session-boundary-0',
        score: 0,
        victory: true,
      };

      const dto1000 = {
        gameSessionId: 'session-boundary-1000',
        score: 1000,
        victory: true,
      };

      const results = await Promise.all([
        service.processGameReward('user-1', dto0),
        service.processGameReward('user-2', dto1000),
      ]);

      expect(results).toHaveLength(2);
      results.forEach((r) => {
        expect(r.status).toBe('success');
      });
    });

    it('should reject high scores (exceeding security threshold)', async () => {
      const dto = {
        gameSessionId: 'session-high-score',
        score: 4010,
        victory: true,
      };

      await expect(service.processGameReward('user-1', dto))
        .rejects.toThrow();
    });
  });
});
