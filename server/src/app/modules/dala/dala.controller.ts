import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, Query } from '@nestjs/common';
import { Request } from 'express';
import { KeycloakJwtPayload } from '../../auth/jwt.strategy';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DalaFacade } from './dala.facade';
import { ConsentService } from '../../consent/consent.service';

/**
 * API interna D.A.L.A. v1 (directrices §13).
 * Usa exclusivamente los contratos públicos de libs/dala/contracts.
 * La ingesta ACKea rápido; el procesamiento es responsabilidad de la fachada.
 */
@Controller('dala/v1')
@UseGuards(JwtAuthGuard)
export class DalaController {
  constructor(
    private readonly facade: DalaFacade,
    private readonly consentService: ConsentService,
  ) {}

  /**
   * La telemetría de juego emite ráfagas legítimas: el límite global
   * (3 req/s) la mataría. Límite propio, alto pero acotado.
   */
  @Throttle({ short: { limit: 50, ttl: 1000 }, medium: { limit: 400, ttl: 10000 } })
  @Post('events')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingest(@Req() req: Request & { user: KeycloakJwtPayload }, @Body() event: DalaBehaviorEvent) {
    const userId = req.user.sub as string;
    const consent = await this.consentService.getCurrentConsent(userId, event.consent?.scopeId || 'research');
    if (!consent || consent.status !== 'GRANTED') {
      return; // Ignore ingestion if no consent
    }
    return this.facade.ingest(event);
  }

  @Throttle({ short: { limit: 10, ttl: 1000 } })
  @Post('events/batch')
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestBatch(@Req() req: Request & { user: KeycloakJwtPayload }, @Body() body: { events: DalaBehaviorEvent[] }) {
    const userId = req.user.sub as string;
    const events = body?.events ?? [];
    if (events.length === 0) return;

    const consentScope = events[0].consent?.scopeId || 'research';
    const consent = await this.consentService.getCurrentConsent(userId, consentScope);
    if (!consent || consent.status !== 'GRANTED') {
      return; // Ignore batch if no consent
    }
    return this.facade.ingestBatch(events);
  }

  @Get('subjects/:subjectId/state')
  getState(@Param('subjectId') subjectId: string) {
    return this.facade.getState(subjectId);
  }

  @Get('subjects/:subjectId/timeline')
  getTimeline(@Param('subjectId') subjectId: string) {
    return this.facade.getTimeline(subjectId);
  }

  /** Seudónimo del usuario autenticado: lo que el web-game usa para emitir. */
  @Post('subjects/resolve')
  resolveSubject(@Req() req: Request & { user: KeycloakJwtPayload }) {
    return this.facade.resolveSubject(req.user.sub as string);
  }

  /** Fase 4 — genera una recomendación en shadow mode (nunca auto-aplica). */
  @Post('decisions')
  decide(@Body() body: { subjectId: string }) {
    return this.facade.decide(body.subjectId);
  }

  @Get('decisions')
  listDecisions(
    @Query('status') status?: 'pending' | 'reviewed',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.facade.listDecisions(status, pageNum, limitNum);
  }

  @Get('decisions/:decisionId')
  getDecision(@Param('decisionId') id: string) {
    return this.facade.getTrace(id).then((t) => t.decision);
  }

  /** Veredicto humano: approved | rejected | edited, con razón. */
  @Post('decisions/:decisionId/review')
  review(
    @Param('decisionId') id: string,
    @Body() body: { verdict: 'approved' | 'rejected' | 'edited'; reason?: string },
  ) {
    return this.facade.review(id, body.verdict, body.reason);
  }

  /** Fase 5 — outcome observado de una intervención. */
  @Post('outcomes')
  recordOutcome(
    @Body()
    body: { decisionId: string; interventionId: string; metrics: Record<string, unknown>; observedAt?: string },
  ) {
    return this.facade.recordOutcome(body);
  }

  /** Traza completa: decisión → snapshot → evidencia → eventos → outcomes. */
  @Get('traces/:decisionId')
  getTrace(@Param('decisionId') id: string) {
    return this.facade.getTrace(id);
  }
}
