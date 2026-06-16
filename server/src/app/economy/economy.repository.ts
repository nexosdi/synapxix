
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';

@Injectable()
export class EconomyRepository {
  private readonly logger = new Logger(EconomyRepository.name);

  constructor(private readonly prisma: PrismaService) {}


  async getBalance(userId: string) {
    return this.prisma.app_user.findUnique({
      where: { user_id: userId },
      select: { credits: true, experience_points: true },
    });
  }

  async findTransactionBySessionId(sessionId: string) {
    return this.prisma.economyTransaction.findUnique({
      where: { game_session_id: sessionId },
    });
  }

  async createRewardTransaction(
    userId: string,
    data: {
      gameSessionId: string;
      creditsAwarded: number;
      xpAwarded: number;
      rewardType: string;
      auditDetails: Record<string, unknown>;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.app_user.update({
        where: { user_id: userId },
        data: {
          credits: { increment: data.creditsAwarded },
          experience_points: { increment: data.xpAwarded },
        },
        select: { credits: true, experience_points: true },
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
        balance: updatedUser,
      };
    });
  }

  async findActiveStoreItem(itemId: string) {
    return this.prisma.storeItem.findFirst({
      where: {
        store_item_id: itemId,
        is_active: true,
      },
    });
  }

  
  async findUserInventoryItem(userId: string, itemId: string) {
    return this.prisma.userInventory.findUnique({
      where: {
        user_id_store_item_id: {
          user_id: userId,
          store_item_id: itemId,
        },
      },
    });
  }

  async createPurchaseTransaction(
    userId: string,
    data: {
      itemId: string;
      itemName: string;
      itemType: string;
      itemPrice: number;
      balanceBefore: number;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.app_user.updateMany({
        where: { user_id: userId, credits: { gte: data.itemPrice } },
        data: { credits: { decrement: data.itemPrice } },
      });

      if (updateResult.count === 0) {
        throw new Error('INSUFFICIENT_FUNDS');
      }

      const updatedUser = await tx.app_user.findUnique({
        where: { user_id: userId },
        select: { credits: true },
      });

      if (!updatedUser) {
        throw new Error('USER_NOT_FOUND');
      }

      const inventoryEntry = await tx.userInventory.create({
        data: {
          user_id: userId,
          store_item_id: data.itemId,
        },
      });

      const purchaseTx = await tx.purchaseTransaction.create({
        data: {
          user_id: userId,
          store_item_id: data.itemId,
          credits_spent: data.itemPrice,
          balance_before: data.balanceBefore,
          balance_after: updatedUser.credits,
        },
      });

      await tx.auditLog.create({
        data: {
          user_id: userId,
          table_name: 'purchase_transaction',
          record_id: purchaseTx.purchase_id,
          details: {
            item_id: data.itemId,
            item_name: data.itemName,
            item_type: data.itemType,
            credits_spent: data.itemPrice,
            balance_before: data.balanceBefore,
            balance_after: updatedUser.credits,
            transaction_type: 'PURCHASE',
          },
        },
      });

      return {
        purchaseId: purchaseTx.purchase_id,
        inventoryId: inventoryEntry.inventory_id,
        newBalance: updatedUser.credits,
      };
    });
  }
}