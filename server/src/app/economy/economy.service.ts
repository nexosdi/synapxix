import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { calculateGameReward } from "./logic/economy.logic";
import { EconomyRepository } from "./economy.repository";
import { ClaimRewardDto } from "./dto/claim.reward.dto";
import { RewardType } from './logic/economy.logic';
@Injectable()
export class EconomyService {
  private readonly logger = new Logger(EconomyService.name);
  private readonly MAX_REWARD_THRESHOLD = 500;

  constructor(private readonly repository: EconomyRepository) {}

  async processGameReward(userId: string, dto: ClaimRewardDto) {
    const amountToAward = calculateGameReward(dto.victory, dto.score);

    this.validateSecurityLimits(userId, amountToAward);

    const existing = await this.repository.findTransactionBySessionId(dto.gameSessionId);
    if (existing) {
      throw new ConflictException(`Reward already claimed for session: ${dto.gameSessionId}`);
    }

    try {
      const result = await this.repository.createTransactionAndAwardCredits(userId, {
        amount: amountToAward,
        gameSessionId: dto.gameSessionId,
        type: dto.victory ? RewardType.VICTORY : RewardType.PARTICIPATION,
        auditDetails: { action: 'REWARD_CLAIMED', score: dto.score }
      });

      this.logger.log(`Credits awarded: User ${userId} (+${amountToAward})`);
      return { status: 'success', ...result };
    } catch (error) {
      return this.handleError(error, userId);
    }
  }

  private validateSecurityLimits(userId: string, amount: number) {
    if (amount > this.MAX_REWARD_THRESHOLD) {
      this.logger.warn(`Security Breach Attempt: User ${userId} requested ${amount}`);
      throw new BadRequestException('Reward exceeds allowed limits');
    }
  }

  private handleError(error: any, userId: string) {
    if (error instanceof ConflictException || error instanceof BadRequestException) throw error;
    this.logger.error(`Economy Error [User: ${userId}]: ${error.message}`, error.stack);
    throw new InternalServerErrorException('Transaction failed');
  }
}