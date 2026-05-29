import { Injectable } from '@nestjs/common';
import { PrismaService } from "@nexosdi.synapxix/prisma";
import { RewardType } from './logic/economy.logic';

@Injectable()
export class EconomyRepository {
  constructor(private prisma: PrismaService) {}

  async findTransactionBySessionId(sessionId: string) {
    return this.prisma.economyTransaction.findUnique({
      where: { game_session_id: sessionId }
    });
  }

  async createTransactionAndAwardCredits(userId: string, data: {
    amount: number,
    gameSessionId: string,
    type: RewardType,
    auditDetails: any
  }) {
    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.app_user.update({
        where: { user_id: userId },
        data: { credits: { increment: data.amount } }
      });

      const economyTx = await tx.economyTransaction.create({
        data: {
          user_id: userId,
          game_session_id: data.gameSessionId,
          amount: data.amount,
          type: data.type
        }
      });

      await tx.auditLog.create({
        data: {
          user_id: userId,
          table_name: 'economy_transaction',
          record_id: economyTx.transaction_id,
          details: { 
            ...data.auditDetails, 
            new_balance: updatedUser.credits,
            transaction_type: data.type 
          }
        }
      });

      return { transactionId: economyTx.transaction_id, balance: updatedUser.credits };
    });
  }
}