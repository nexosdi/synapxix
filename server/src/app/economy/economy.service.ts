import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { calculateGameReward, calculateXP, validatePurchase } from './logic/economy.logic';
import { EconomyRepository } from './economy.repository';
import { ClaimRewardDto } from './dto/claim.reward.dto';
import { ClaimRewardResponseDto } from './dto/claim-reward-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { RewardType } from './logic/economy.logic';
import { PurchaseDto } from './dto/purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';

@Injectable()
export class EconomyService {
  private readonly logger = new Logger(EconomyService.name);
  private readonly MAX_REWARD_THRESHOLD = 500;

  constructor(private readonly repository: EconomyRepository) {}

  async processGameReward(
    userId: string,
    dto: ClaimRewardDto
  ): Promise<ClaimRewardResponseDto> {
    const creditsToAward = calculateGameReward(dto.victory, dto.score);

    this.validateSecurityLimits(userId, creditsToAward);

    const existing = await this.repository.findTransactionBySessionId(
      dto.gameSessionId
    );
    if (existing) {
      throw new ConflictException(
        `Reward already claimed for session: ${dto.gameSessionId}`
      );
    }

    try {
      const xpToAward = calculateXP(dto.victory, dto.score);
      const result = await this.repository.createRewardTransaction(userId, {
        creditsAwarded: creditsToAward,
        xpAwarded: xpToAward,
        gameSessionId: dto.gameSessionId,
        rewardType: dto.victory ? RewardType.VICTORY : RewardType.PARTICIPATION,
        auditDetails: { action: 'REWARD_CLAIMED', score: dto.score },
      });

      this.logger.log(
        `Reward awarded: User ${userId} (+${creditsToAward} credits, +${xpToAward} XP)`
      );

      return {
        status: 'success',
        transactionId: result.transactionId,
        balance: result.balance,
        reward: {
          credits: creditsToAward,
          xp: xpToAward,
        },
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.handleError(error, userId);
    }
  }

  async getBalance(userId: string): Promise<BalanceResponseDto> {
    const user = await this.repository.getBalance(userId);

    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    return {
      credits: user.credits,
      experience_points: user.experience_points,
    };
  }

  private validateSecurityLimits(userId: string, amount: number): void {
    if (amount > this.MAX_REWARD_THRESHOLD) {
      this.logger.warn(
        `Security breach attempt: User ${userId} requested ${amount} credits`
      );
      throw new BadRequestException('Reward exceeds allowed limits');
    }
  }

  private handleError(error: unknown, userId: string): never {
    if (
      error instanceof ConflictException ||
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Reward already claimed for this session');
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new BadRequestException('Referenced resource not found');
    }

    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(`Economy error [User: ${userId}]: ${message}`, stack);
    throw new InternalServerErrorException('Transaction failed');
  }

  async processPurchase(
    userId: string,
    dto: PurchaseDto
  ): Promise<PurchaseResponseDto> {
    const item = await this.repository.findActiveStoreItem(dto.itemId);
    if (!item) {
      throw new NotFoundException(
        `Item ${dto.itemId} not found or not available`
      );
    }

    const wallet = await this.repository.getBalance(userId);
    if (!wallet) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    const validation = validatePurchase(wallet.credits, item.price);
    if (!validation.valid) {
      throw new BadRequestException(
        `Insufficient funds: need ${item.price} credits, have ${wallet.credits}`
      );
    }

    const alreadyOwned = await this.repository.findUserInventoryItem(
      userId,
      dto.itemId
    );
    if (alreadyOwned) {
      throw new ConflictException('User already owns this item');
    }

    try {
      const result = await this.repository.createPurchaseTransaction(userId, {
        itemId: item.store_item_id,
        itemName: item.name,
        itemType: item.type,
        itemPrice: item.price,
        balanceBefore: wallet.credits,
      });

      this.logger.log(
        `Purchase completed: User ${userId} bought "${item.name}" (-${item.price} credits)`
      );

      return {
        status: 'success',
        purchaseId: result.purchaseId,
        itemId: item.store_item_id,
        itemName: item.name,
        itemType: item.type,
        creditsSpent: item.price,
        newBalance: result.newBalance,
        processedAt: new Date(),
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User already owns this item');
      }

      if (
        error instanceof Error &&
        error.message === 'INSUFFICIENT_FUNDS'
      ) {
        throw new BadRequestException(
          'Insufficient funds: balance changed during transaction'
        );
      }

      if (
        error instanceof Error &&
        error.message === 'USER_NOT_FOUND'
      ) {
        throw new NotFoundException(`User not found: ${userId}`);
      }

      this.handleError(error, userId);
    }
  }
}