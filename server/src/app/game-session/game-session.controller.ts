import { Controller, Post, Get, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KeycloakJwtPayload } from '../auth/jwt.strategy';
import { GameSessionService } from './game-session.service';
import { StartSessionDto, SubmitAttemptDto } from './dto/game-session.dto';

/** Roles que pueden consultar el reporte de otra persona. */
const STAFF_ROLES = ['teacher', 'director', 'assistant'];

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

  /** Reporte propio: qué juegos jugó quien hace la llamada y cómo le fue. */
  @Get('me/report')
  getOwnReport(@Req() req: Request & { user: KeycloakJwtPayload }) {
    return this.gameSessionService.getUserReport(req.user.sub!);
  }

  /**
   * Reporte de un usuario concreto.
   *
   * Reservado a docentes/dirección: sin este chequeo cualquier alumno podría
   * leer la actividad de otro cambiando el id de la URL.
   */
  @Get('user/:userId/report')
  getUserReport(
    @Req() req: Request & { user: KeycloakJwtPayload },
    @Param('userId') userId: string,
  ) {
    const requesterId = req.user.sub!;
    const roles = req.user.realm_access?.roles ?? [];
    const isStaff = roles.some((role) => STAFF_ROLES.includes(role));

    if (requesterId !== userId && !isStaff) {
      throw new ForbiddenException('No tenés acceso al reporte de otro usuario');
    }

    return this.gameSessionService.getUserReport(userId);
  }
}
