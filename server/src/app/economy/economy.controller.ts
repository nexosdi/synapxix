import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { ClaimRewardDto } from './dto/claim.reward.dto';
import { EconomyService } from './economy.service';

@Controller('economy')
@UseGuards(JwtAuthGuard)
export class EconomyController {
  constructor(private readonly economyService: EconomyService) {}

  @Post('claim-reward')
  async claimReward(
    @GetUser('user_id') userId: string,
    @Body() dto: ClaimRewardDto
  ) {
    return this.economyService.processGameReward(userId, dto);
  }

  @Get('balance')
  async getBalance(@GetUser('user_id') userId: string) {
    return this.economyService.getBalance(userId);
  }
}