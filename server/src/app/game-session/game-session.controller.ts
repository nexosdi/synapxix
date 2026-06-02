import { Controller, Post, Body, Param } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { StartSessionDto, SubmitAttemptDto } from './dto/game-session.dto';
// Omitiendo el guardia temporalmente o haciéndolo opcional, dado que el userId puede ser null, 
// pero vamos a dejar que las rutas sean públicas por ahora, o si requieren JWT, el userId puede ser null.
// Dado el requerimiento "userId se mantendrá en null intencionalmente", mejor sin JwtAuthGuard en estos endpoints, 
// o un JWT opcional. Como no hay un guardia de jwt-optional a mano, lo dejo sin guardia para facilitar pruebas.

@Controller('game-session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post('start')
  startSession(@Body() dto: StartSessionDto) {
    return this.gameSessionService.startSession(dto);
  }

  @Post(':id/attempt')
  submitAttempt(@Param('id') id: string, @Body() dto: SubmitAttemptDto) {
    return this.gameSessionService.submitAttempt(id, dto);
  }

  @Post(':id/complete')
  completeSession(@Param('id') id: string) {
    return this.gameSessionService.completeSession(id);
  }
}
