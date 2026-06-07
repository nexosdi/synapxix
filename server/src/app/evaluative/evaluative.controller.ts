import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluateSessionDto } from './dto/evaluate-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) return request.user?.[data];
  return request.user;
});

@Controller('evaluative')
@UseGuards(JwtAuthGuard)
export class EvaluativeController {
  constructor(private readonly evaluativeService: EvaluativeService) {}

  /**
   * Endpoint to process a game session and generate cognitive metrics.
   * Expects an exact structure of game data (EvaluateSessionDto).
   */
  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateSession(
    @GetUser('user_id') userId: string,
    @Body() dto: EvaluateSessionDto,
  ) {
    const metric = await this.evaluativeService.evaluateAndPersist({ ...dto, userId });
    return {
      success: true,
      message: 'Cognitive metrics evaluated and persisted successfully',
      data: metric,
    };
  }
}
