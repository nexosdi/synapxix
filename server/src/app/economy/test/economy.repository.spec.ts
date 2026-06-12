import { Test, TestingModule } from '@nestjs/testing';
import { EconomyRepository } from '../economy.repository';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { Prisma } from '@prisma/client';
import { RewardType } from '../logic/economy.logic';

describe('EconomyRepository — Integration Tests', () => {
  let repository: EconomyRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomyRepository,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            economyTransaction: { findUnique: jest.fn() },
            app_user: { findUnique: jest.fn(), update: jest.fn() },
            auditLog: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    repository = module.get<EconomyRepository>(EconomyRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createRewardTransaction — Atomicity', () => {
    it('should rollback if AuditLog fails during transaction', async () => {
      const mockTx = jest.fn(async (callback) => {
        throw new Error('Transaction rolled back');
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(mockTx);

      await expect(
        repository.createRewardTransaction('user-1', {
          creditsAwarded: 100,
          xpAwarded: 0,
          gameSessionId: 'session-1',
          rewardType: RewardType.VICTORY,
          auditDetails: {},
        })
      ).rejects.toThrow('Transaction rolled back');
    });

    it('should increment credits in same transaction as EconomyTransaction creation', async () => {
      const mockTx = jest.fn(async (callback) => {
        const txClient = {
          app_user: {
            update: jest.fn().mockResolvedValue({
              credits: 110,
              experience_points: 0,

            }),
          },
          economyTransaction: {
            create: jest.fn().mockResolvedValue({
              transaction_id: 'tx-1',
              user_id: 'user-1',
              game_session_id: 'session-1',
              amount: 100,
              type: 'GAME_VICTORY',
              created_at: new Date(),
            }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({
              audit_id: 'audit-1',
            }),
          },
        };
        return await callback(txClient);
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(mockTx);

      const result = await repository.createRewardTransaction('user-1', {
        creditsAwarded: 100,
        xpAwarded: 0,
        gameSessionId: 'session-1',
        rewardType: RewardType.VICTORY,
        auditDetails: { action: 'TEST' },
      });

      expect(result.transactionId).toBe('tx-1');
      expect(result.balance).toEqual({ credits: 110, experience_points: 0 });
      expect(mockTx).toHaveBeenCalled();
    });

    it('should catch P2002 (unique constraint) and rethrow as-is', async () => {
      const p2002Error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (game_session_id)',
        {
          code: 'P2002',
          clientVersion: 'test',
        } as any
      );

      (prismaService.$transaction as jest.Mock).mockRejectedValue(p2002Error);

      await expect(
        repository.createRewardTransaction('user-1', {
          creditsAwarded: 100,
          xpAwarded: 0,
          gameSessionId: 'session-1',
          rewardType: RewardType.VICTORY,
          auditDetails: {},
        })
      ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });

    it('should handle FK violation (user_id not found)', async () => {
      const fkError = new Prisma.PrismaClientKnownRequestError(
        'Foreign key constraint failed on the field: (user_id)',
        {
          code: 'P2003',
          clientVersion: 'test',
        } as any
      );

      (prismaService.$transaction as jest.Mock).mockRejectedValue(fkError);

      await expect(
        repository.createRewardTransaction('invalid-user', {
          creditsAwarded: 100,
          xpAwarded: 0,
          gameSessionId: 'session-1',
          rewardType: RewardType.VICTORY,
          auditDetails: {},
        })
      ).rejects.toThrow(Prisma.PrismaClientKnownRequestError);
    });
  });
  describe('getBalance', () => {
  it('should return credits and experience_points for a valid user', async () => {
    (prismaService.app_user.findUnique as jest.Mock).mockResolvedValue({
      credits: 215,
      experience_points: 1057,
    });

    const result = await repository.getBalance('user-1');

    expect(result).toEqual({ credits: 215, experience_points: 1057 });
    expect(prismaService.app_user.findUnique).toHaveBeenCalledWith({
      where: { user_id: 'user-1' },
      select: { credits: true, experience_points: true },
    });
  });

  it('should return null when user does not exist', async () => {
    (prismaService.app_user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repository.getBalance('ghost-user');

    expect(result).toBeNull();
  });
});
});