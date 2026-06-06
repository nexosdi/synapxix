import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';
import { calculateGameReward } from '../logic/economy.logic';


describe('calculateGameReward — edge cases', () => {
  it('should award base victory credits when score is 0', () => {
    expect(calculateGameReward(true, 0)).toBe(100);
  });

  it('should award base participation credits when score is 0', () => {
    expect(calculateGameReward(false, 0)).toBe(20);
  });

  it('should not apply bonus for score below 10 (floor behavior)', () => {
    expect(calculateGameReward(true, 9)).toBe(100);
  });

  it('should apply bonus of +1 at score exactly 10', () => {
    expect(calculateGameReward(true, 10)).toBe(101);
  });

  it('should handle score at DTO maximum (1000) without exceeding threshold', () => {
    // 100 base + floor(1000/10) = 200 — dentro del MAX_REWARD_THRESHOLD de 500
    expect(calculateGameReward(true, 1000)).toBe(200);
  });

  it('should be deterministic for identical inputs', () => {
    expect(calculateGameReward(true, 350)).toBe(calculateGameReward(true, 350));
  });
});


describe('EconomyService — edge cases', () => {
  let service: EconomyService;

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
    jest.clearAllMocks();
  });

  it('should throw BadRequestException when reward exceeds MAX_REWARD_THRESHOLD', async () => {
    const dto = { gameSessionId: 'edge-1', score: 4010, victory: true };
    await expect(service.processGameReward('user-1', dto))
      .rejects.toThrow(BadRequestException);
  });

  it('should NOT throw when reward is exactly at MAX_REWARD_THRESHOLD (500)', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockResolvedValue({
      transactionId: 'tx-boundary',
      balance: 500,
    });

    const dto = { gameSessionId: 'edge-2', score: 4000, victory: true };
    const result = await service.processGameReward('user-1', dto) as any;
    expect(result.status).toBe('success');
  });

  it('should throw ConflictException on duplicate sessionId regardless of score', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue({ id: 'existing' });

    const dto = { gameSessionId: 'dup-session', score: 0, victory: false };
    await expect(service.processGameReward('user-2', dto))
      .rejects.toThrow(ConflictException);
  });

  it('should wrap unexpected repository errors in InternalServerErrorException', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockRejectedValue(
      new Error('DB connection lost')
    );

    const dto = { gameSessionId: 'err-session', score: 100, victory: true };
    await expect(service.processGameReward('user-3', dto))
      .rejects.toThrow(InternalServerErrorException);
  });

  it('should call repository with PARTICIPATION type for a loss', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockResolvedValue({
      transactionId: 'tx-loss',
      balance: 25,
    });

    const dto = { gameSessionId: 'loss-1', score: 50, victory: false };
    await service.processGameReward('user-4', dto);

    expect(mockRepository.createRewardTransaction).toHaveBeenCalledWith(
      'user-4',
      expect.objectContaining({ rewardType: 'GAME_PARTICIPATION' })
    );
  });

  it('should call repository with VICTORY type for a win', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockResolvedValue({
      transactionId: 'tx-win',
      balance: 110,
    });

    const dto = { gameSessionId: 'win-1', score: 100, victory: true };
    await service.processGameReward('user-5', dto);

    expect(mockRepository.createRewardTransaction).toHaveBeenCalledWith(
      'user-5',
      expect.objectContaining({ rewardType: 'GAME_VICTORY' })
    );
  });
});