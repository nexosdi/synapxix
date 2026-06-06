import { Test, TestingModule } from '@nestjs/testing';
import { EconomyService } from '../economy.service';
import { EconomyRepository } from '../economy.repository';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('EconomyService', () => {
  let service: EconomyService;
  let repository: EconomyRepository;

  const mockRepository = {
    findTransactionBySessionId: jest.fn(),
    createRewardTransaction: jest.fn(),
    getBalance: jest.fn(),
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

  it('should throw ConflictException if transaction already exists', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue({ id: 'exists' });

    const dto = { gameSessionId: '123', score: 10, victory: true };
    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(ConflictException);
  });

  it('should throw BadRequestException if reward is too high', async () => {
    const dto = { gameSessionId: '123', score: 10000, victory: true };
    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should map Prisma P2002 to ConflictException (race-condition idempotency)', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      } as any)
    );

    const dto = { gameSessionId: '123', score: 10, victory: true };

    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(ConflictException);
  });

  it('should map Prisma P2003 to BadRequestException (FK violation)', async () => {
    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: 'test',
      } as any)
    );

    const dto = { gameSessionId: '123', score: 10, victory: true };

    await expect(service.processGameReward('user-1', dto))
      .rejects
      .toThrow(BadRequestException);
  });

  it('should successfully process and award credits', async () => {
    const dto = { gameSessionId: 'session-123', score: 100, victory: true };
    const userId = 'user-123';

    mockRepository.findTransactionBySessionId.mockResolvedValue(null);
    mockRepository.createRewardTransaction.mockResolvedValue({
      transactionId: 'tx-456',
      balance: { credits: 110, experience_points: 55 },
    });

    const result = await service.processGameReward(userId, dto) as any;

    expect(result.status).toBe('success');
    expect(result.balance.credits).toBe(110);
    expect(mockRepository.createRewardTransaction).toHaveBeenCalled();
  });

  describe('getBalance', () => {
    it('should return balance for a valid user', async () => {
      mockRepository.getBalance.mockResolvedValue({
        credits: 215,
        experience_points: 1057,
      });

      const result = await service.getBalance('user-1');

      expect(result).toEqual({ credits: 215, experience_points: 1057 });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.getBalance.mockResolvedValue(null);

      await expect(service.getBalance('ghost-user'))
        .rejects.toThrow(NotFoundException);
    });
  });
});