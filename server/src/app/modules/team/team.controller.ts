import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { TeamAdminGuard, TeamAuthGuard, TeamTokenPayload } from './team-auth.guard';
import { TeamService } from './team.service';
import type { DeclaredProfile, TeamArchetype } from './archetype';

type TeamRequest = Request & { teamMember: TeamTokenPayload };

/**
 * API del Primer Pulso (onboarding del equipo sobre D.A.L.A.).
 * Identidad por invitación; autorización de sujeto en el service.
 */
@Controller('team/v1')
export class TeamController {
  constructor(private readonly service: TeamService) {}

  /** Entrada con link/código de invitación. */
  @Throttle({ short: { limit: 5, ttl: 1000 }, medium: { limit: 20, ttl: 10000 } })
  @Post('join')
  join(@Body() body: { inviteCode: string; name?: string; roleLabel?: string }) {
    return this.service.join(body?.inviteCode, body?.name, body?.roleLabel);
  }

  /**
   * Inscripción abierta del onboarding web (sin código). Idempotente por
   * email: la persona que vuelve recupera su sujeto y acumula modelo.
   */
  @Throttle({ short: { limit: 5, ttl: 1000 }, medium: { limit: 15, ttl: 10000 } })
  @Post('register')
  register(@Body() body: { name?: string; email?: string; age?: number; area?: string }) {
    return this.service.register(body ?? {});
  }

  @UseGuards(TeamAuthGuard)
  @Get('me')
  me(@Req() req: TeamRequest) {
    return this.service.me(req.teamMember);
  }

  /** Telemetría del juego: ráfagas legítimas, límite propio como en dala. */
  @UseGuards(TeamAuthGuard)
  @Throttle({ short: { limit: 50, ttl: 1000 }, medium: { limit: 400, ttl: 10000 } })
  @Post('events/batch')
  @HttpCode(HttpStatus.ACCEPTED)
  ingestBatch(@Req() req: TeamRequest, @Body() body: { events: DalaBehaviorEvent[] }) {
    return this.service.ingestBatch(req.teamMember, body?.events ?? []);
  }

  @UseGuards(TeamAuthGuard)
  @Post('declared')
  saveDeclared(@Req() req: TeamRequest, @Body() body: DeclaredProfile) {
    return this.service.saveDeclared(req.teamMember, body ?? {});
  }

  @UseGuards(TeamAuthGuard)
  @Post('complete')
  complete(@Req() req: TeamRequest, @Body() body: { archetype?: string }) {
    return this.service.complete(req.teamMember, body?.archetype);
  }

  /** Decisión shadow sobre el propio estado (fase 4 D.A.L.A. en vivo). */
  @UseGuards(TeamAuthGuard)
  @Post('me/decision')
  decide(@Req() req: TeamRequest) {
    return this.service.decide(req.teamMember);
  }

  /** La persona revisa su propia recomendación: shadow mode encarnado. */
  @UseGuards(TeamAuthGuard)
  @Post('me/decisions/:decisionId/review')
  review(
    @Req() req: TeamRequest,
    @Param('decisionId') decisionId: string,
    @Body() body: { verdict: 'approved' | 'rejected' | 'edited'; reason?: string },
  ) {
    return this.service.review(req.teamMember, decisionId, body?.verdict, body?.reason);
  }

  @UseGuards(TeamAuthGuard)
  @Post('me/outcomes')
  recordOutcome(
    @Req() req: TeamRequest,
    @Body() body: { decisionId: string; interventionId: string; metrics: Record<string, unknown> },
  ) {
    return this.service.recordOutcome(req.teamMember, body);
  }

  @UseGuards(TeamAuthGuard)
  @Get('me/trace/:decisionId')
  trace(@Req() req: TeamRequest, @Param('decisionId') decisionId: string) {
    return this.service.trace(req.teamMember, decisionId);
  }

  /** Modelado completo de la persona (estado + declarado + arquetipos). */
  @UseGuards(TeamAuthGuard)
  @Get('me/report')
  report(@Req() req: TeamRequest) {
    return this.service.report(req.teamMember);
  }

  /** Estrella ilustrada con IA. Opcional: requiere GEMINI_API_KEY. */
  @UseGuards(TeamAuthGuard)
  @Throttle({ medium: { limit: 3, ttl: 60000 } })
  @Post('me/star/ai')
  starAi(@Req() req: TeamRequest, @Body() body: { archetype: TeamArchetype }) {
    return this.service.generateStarImage(req.teamMember, body?.archetype);
  }

  // ── Administración (X-Team-Admin-Code) ──────────────────────────────────

  @UseGuards(TeamAdminGuard)
  @Post('admin/invites')
  createInvites(@Body() body: { people: Array<{ name?: string; email?: string; roleLabel?: string }> }) {
    return this.service.createInvites(body?.people ?? []);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members')
  listMembers() {
    return this.service.listMembers();
  }
}
