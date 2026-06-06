import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { RewardType } from './logic/economy.logic';

@Injectable()
export class EconomyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTransactionBySessionId(sessionId: string) {
    return this.prisma.economyTransaction.findUnique({
      where: { game_session_id: sessionId },
    });
  }

  async getBalance(userId: string) {
    return this.prisma.app_user.findUnique({
      where: { user_id: userId },
      select: {
        credits: true,
        experience_points: true,
      },
    });
  }

  async createRewardTransaction(
    userId: string,
    data: {
      creditsAwarded: number;
      xpAwarded: number;
      gameSessionId: string;
      rewardType: RewardType;
      auditDetails: Record<string, unknown>;
    }
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.app_user.update({
        where: { user_id: userId },
        data: {
          credits: { increment: data.creditsAwarded },
          experience_points: { increment: data.xpAwarded },
        },
      });

      const economyTx = await tx.economyTransaction.create({
        data: {
          user_id: userId,
          game_session_id: data.gameSessionId,
          credits_awarded: data.creditsAwarded,
          xp_awarded: data.xpAwarded,
          reward_type: data.rewardType,
        },
      });

      await tx.auditLog.create({
        data: {
          user_id: userId,
          table_name: 'economy_transaction',
          record_id: economyTx.transaction_id,
          details: {
            ...data.auditDetails,
            new_balance: updatedUser.credits,
            new_experience_points: updatedUser.experience_points,
            transaction_type: data.rewardType,
          },
        },
      });

      return {
        transactionId: economyTx.transaction_id,
        balance: {
          credits: updatedUser.credits,
          experience_points: updatedUser.experience_points,
        },
      };
    });
  }
}