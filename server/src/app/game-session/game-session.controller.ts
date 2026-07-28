import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KeycloakJwtPayload } from '../auth/jwt.strategy';
import { GameSessionService } from './game-session.service';
import { StartSessionDto, SubmitAttemptDto } from './dto/game-session.dto';

@Controller('game-session')
@UseGuards(JwtAuthGuard)
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post('start')
  startSession(@Req() req: Request & { user: KeycloakJwtPayload }, @Body() dto: StartSessionDto) {
    const userId = req.user.sub!;
    return this.gameSessionService.startSession(userId, dto);
  }

  @Post(':id/attempt')
  submitAttempt(@Req() req: Request & { user: KeycloakJwtPayload }, @Param('id') id: string, @Body() dto: SubmitAttemptDto) {
    const userId = req.user.sub!;
    return this.gameSessionService.submitAttempt(userId, id, dto);
  }

  @Post(':id/complete')
  completeSession(@Req() req: Request & { user: KeycloakJwtPayload }, @Param('id') id: string) {
    const userId = req.user.sub!;
    return this.gameSessionService.completeSession(userId, id);
  }
}
