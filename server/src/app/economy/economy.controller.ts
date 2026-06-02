import { Body, Controller, createParamDecorator, ExecutionContext, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClaimRewardDto } from './dto/claim.reward.dto';
import { EconomyService } from './economy.service';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) return request.user?.[data];
  return request.user;
});

@Controller('economy')
@UseGuards(JwtAuthGuard) 
export class EconomyController {
  constructor(private readonly economyService: EconomyService) {}

  @Post('claim-reward')
  async claimReward(
    @GetUser('user_id') userId: string, 
    @Body() dto: ClaimRewardDto
  ) {
    return await this.economyService.processGameReward(userId, dto);
  }
}
