import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DalaFacade } from './dala.facade';

/**
 * API interna D.A.L.A. v1 (directrices §13).
 * Usa exclusivamente los contratos públicos de libs/dala/contracts.
 * La ingesta ACKea rápido; el procesamiento es responsabilidad de la fachada.
 */
@Controller('dala/v1')
@UseGuards(JwtAuthGuard)
export class DalaController {
  constructor(private readonly facade: DalaFacade) {}

  /**
   * La telemetría de juego emite ráfagas legítimas: el límite global
   * (3 req/s) la mataría. Límite propio, alto pero acotado.
   */
  @Throttle({ short: { limit: 50, ttl: 1000 }, medium: { limit: 400, ttl: 10000 } })
  @Post('events')
  @HttpCode(HttpStatus.ACCEPTED)
  ingest(@Body() event: DalaBehaviorEvent) {
    return this.facade.ingest(event);
  }

  @Throttle({ short: { limit: 10, ttl: 1000 } })
  @Post('events/batch')
  @HttpCode(HttpStatus.ACCEPTED)
  ingestBatch(@Body() body: { events: DalaBehaviorEvent[] }) {
    return this.facade.ingestBatch(body?.events ?? []);
  }

  @Get('subjects/:subjectId/state')
  getState(@Param('subjectId') subjectId: string) {
    return this.facade.getState(subjectId);
  }

  @Get('subjects/:subjectId/timeline')
  getTimeline(@Param('subjectId') subjectId: string) {
    return this.facade.getTimeline(subjectId);
  }
}
