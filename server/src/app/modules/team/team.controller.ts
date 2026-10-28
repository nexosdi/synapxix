import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import type { DalaBehaviorEvent, DalaEventV2 } from '@nexosdi.synapxix/dala/contracts';
import { TeamAdminGuard, TeamAuthGuard, TeamTokenPayload } from './team-auth.guard';
import { TeamService, type ConsentChoice, type ProfileDocumentsInput } from './team.service';
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
  join(@Body() body: { inviteCode: string; name?: string; roleLabel?: string; consent?: ConsentChoice }) {
    return this.service.join(body?.inviteCode, body?.name, body?.roleLabel, body?.consent);
  }

  /**
   * Inscripción abierta del onboarding web (sin código). Idempotente por
   * email: la persona que vuelve recupera su sujeto y acumula modelo.
   */
  @Throttle({ short: { limit: 5, ttl: 1000 }, medium: { limit: 15, ttl: 10000 } })
  @Post('register')
  register(@Body() body: { name?: string; email?: string; age?: number; area?: string; consent?: ConsentChoice }) {
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
  ingestBatch(@Req() req: TeamRequest, @Body() body: { events: Array<DalaBehaviorEvent | DalaEventV2> }) {
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
    @Body() body: { verdict: 'approved' | 'rejected' | 'edited'; reason?: string; chosen?: string },
  ) {
    return this.service.review(req.teamMember, decisionId, body?.verdict, body?.reason, body?.chosen);
  }

  @UseGuards(TeamAuthGuard)
  @Post('me/outcomes')
  recordOutcome(
    @Req() req: TeamRequest,
    @Body() body: { decisionId: string; interventionId: string; metrics: Record<string, unknown> },
  ) {
    return this.service.recordOutcome(req.teamMember, body);
  }

  /** De una afirmación a los eventos que la sostienen. */
  @UseGuards(TeamAuthGuard)
  @Get('me/claims/:claimKey/trace')
  traceClaim(@Req() req: TeamRequest, @Param('claimKey') claimKey: string) {
    return this.service.traceClaim(req.teamMember, claimKey);
  }

  /** Datos propios, seudónimos, para descargar. */
  @UseGuards(TeamAuthGuard)
  @Get('me/export')
  exportOwn(@Req() req: TeamRequest) {
    return this.service.exportOwn(req.teamMember);
  }

  /** ¿La última instantánea se reproduce idéntica desde el registro? */
  @UseGuards(TeamAuthGuard)
  @Get('me/replay')
  replayCheck(@Req() req: TeamRequest) {
    return this.service.replayCheck(req.teamMember);
  }

  /** Retrato trazable: instantánea vigente + declarado + decisiones. */
  @UseGuards(TeamAuthGuard)
  @Get('me/report')
  report(@Req() req: TeamRequest, @Query('since') since?: string) {
    return this.service.report(req.teamMember, since);
  }

  /** CV y enlaces profesionales, con su propia autorización. */
  @UseGuards(TeamAuthGuard)
  @Throttle({ medium: { limit: 5, ttl: 60000 } })
  @Post('me/cv')
  saveCv(@Req() req: TeamRequest, @Body() body: ProfileDocumentsInput) {
    return this.service.saveProfileDocuments(req.teamMember, body ?? {});
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

  // ── Vista de investigación ──────────────────────────────────────────────

  @UseGuards(TeamAdminGuard)
  @Delete('admin/members/:memberId')
  removeMember(@Param('memberId') memberId: string) {
    return this.service.removeMember(memberId);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/report')
  adminReport(@Param('memberId') memberId: string) {
    return this.service.adminReport(memberId);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/claims/:claimKey/trace')
  adminTrace(@Param('memberId') memberId: string, @Param('claimKey') claimKey: string) {
    return this.service.adminTrace(memberId, claimKey);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/export')
  adminExport(@Param('memberId') memberId: string) {
    return this.service.adminExport(memberId);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/documents')
  adminDocuments(@Param('memberId') memberId: string) {
    return this.service.adminDocuments(memberId);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/documents/:documentId')
  async adminDocument(@Param('memberId') memberId: string, @Param('documentId') documentId: string, @Res() res: Response) {
    const doc = await this.service.adminDocument(memberId, documentId);
    res.setHeader('Content-Type', doc.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.filename)}"`);
    res.send(doc.data);
  }

  @UseGuards(TeamAdminGuard)
  @Get('admin/members/:memberId/replay')
  adminReplay(@Param('memberId') memberId: string) {
    return this.service.adminReplay(memberId);
  }
}
