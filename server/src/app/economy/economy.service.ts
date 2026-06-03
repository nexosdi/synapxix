import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { calculateGameReward, calculateXP } from './logic/economy.logic';
import { EconomyRepository } from './economy.repository';
import { ClaimRewardDto } from './dto/claim.reward.dto';
import { ClaimRewardResponseDto } from './dto/claim-reward-response.dto';
import { RewardType } from './logic/economy.logic';

@Injectable()
export class EconomyService {
  private readonly logger = new Logger(EconomyService.name);
  private readonly MAX_REWARD_THRESHOLD = 500;

  constructor(private readonly repository: EconomyRepository) {}

  async processGameReward(userId: string, dto: ClaimRewardDto) {
    const amountToAward = calculateGameReward(dto.victory, dto.score);

    this.validateSecurityLimits(userId, amountToAward);

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
        creditsAwarded: amountToAward,
        xpAwarded: xpToAward,
        gameSessionId: dto.gameSessionId,
        rewardType: dto.victory ? RewardType.VICTORY : RewardType.PARTICIPATION,
        auditDetails: { action: 'REWARD_CLAIMED', score: dto.score },
      });

      this.logger.log(
        `Reward awarded: User ${userId} (+${amountToAward} credits, +${xpToAward} XP)`
      );

      const response: ClaimRewardResponseDto = {
        status: 'success',
        transactionId: result.transactionId,
        balance: result.balance,
        reward: {
          credits: amountToAward,
          xp: xpToAward,
        },
        processedAt: new Date().toISOString(),
      };

      return response;
    } catch (error) {
      this.handleError(error, userId);
    }
  }

  private validateSecurityLimits(userId: string, amount: number) {
    if (amount > this.MAX_REWARD_THRESHOLD) {
      this.logger.warn(
        `Security Breach Attempt: User ${userId} requested ${amount}`
      );
      throw new BadRequestException('Reward exceeds allowed limits');
    }
  }

  private handleError(error: any, userId: string): never {
    if (error instanceof ConflictException || error instanceof BadRequestException) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Reward already claimed for this session');
    }

    this.logger.error(
      `Economy Error [User: ${userId}]: ${error?.message ?? error}`,
      error?.stack
    );
    throw new InternalServerErrorException('Transaction failed');
  }
}

