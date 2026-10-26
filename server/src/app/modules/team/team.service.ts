import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  DALA_EVENT_SCHEMA_V2,
  type DalaBehaviorEvent,
  type DalaEventV2,
} from '@nexosdi.synapxix/dala/contracts';
import { DalaFacade } from '../dala/dala.facade';
import { TeamRepository } from './team.repository';
import { TEAM_JWT_SECRET, TeamTokenPayload } from './team-auth.guard';
import { ARCHETYPE_META, DeclaredProfile, TEAM_ARCHETYPES, TeamArchetype } from './archetype';

/** Versión del consentimiento del Primer Pulso. El equipo lo acepta al entrar. */
export const TEAM_CONSENT_SCOPE = 'team-primer-pulso-v1';

/**
 * Primer Pulso — orquestación del onboarding del equipo sobre D.A.L.A.
 *
 * Regla arquitectónica intacta: este módulo NO implementa lógica D.A.L.A.
 * Todo lo conductual (ingesta, evidencia, estado, decisiones, outcomes,
 * trazas) pasa por la fachada. Aquí vive lo que es del equipo: identidad
 * por invitación, lo declarado, el arquetipo narrativo y el reporte.
 */
@Injectable()
export class TeamService {
  constructor(
    private readonly repository: TeamRepository,
    private readonly dala: DalaFacade,
  ) {}

  // ── Identidad ────────────────────────────────────────────────────────────

  async join(inviteCode: string, name?: string, roleLabel?: string) {
    const member = await this.repository.findByInviteCode(inviteCode?.trim()?.toUpperCase() ?? '');
    if (!member) throw new NotFoundException('unknown_invite_code');

    const updated = await this.repository.markJoined(member.member_id, name, roleLabel);
    // El seudónimo se resuelve igual que para cualquier usuario: mapeo en auth.
    const { subjectId } = await this.dala.resolveSubject(member.member_id);

    const payload: TeamTokenPayload = {
      sub: member.member_id,
      subjectId,
      name: updated.name ?? 'pulso',
      scope: 'team-pulse',
    };
    const token = jwt.sign(payload, TEAM_JWT_SECRET(), { expiresIn: '24h' });

    return {
      token,
      subjectId,
      consent: { scopeId: TEAM_CONSENT_SCOPE, researchAllowed: true },
      member: this.publicMember(updated),
    };
  }

  /**
   * Inscripción abierta (onboarding web): nombre + email + edad + área, sin
   * código. Idempotente por email — la misma persona que vuelve recupera su
   * miembro y su seudónimo, y su modelo dinámico ACUMULA entre sesiones.
   * Se desactiva con TEAM_OPEN_REGISTRATION=0.
   */
  async register(input: { name?: string; email?: string; age?: number; area?: string }) {
    if (process.env['TEAM_OPEN_REGISTRATION'] === '0') {
      throw new ForbiddenException('open_registration_disabled');
    }
    const name = input.name?.trim() ?? '';
    const email = input.email?.trim().toLowerCase() ?? '';
    const age = Number(input.age);
    if (name.length < 2) throw new BadRequestException('invalid_name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('invalid_email');
    // Piloto adultos: fuera de rango no se procesa (regla del protocolo v0.2).
    if (!Number.isInteger(age) || age < 21 || age > 36) {
      throw new BadRequestException('age_out_of_pilot_range');
    }

    const existing = await this.repository.findByEmail(email);
    const member = existing
      ? await this.repository.markJoined(existing.member_id, name, input.area)
      : await this.repository.createOpen({ name, email, roleLabel: input.area });

    const { subjectId } = await this.dala.resolveSubject(member.member_id);
    const payload: TeamTokenPayload = {
      sub: member.member_id,
      subjectId,
      name: member.name ?? 'pulso',
      scope: 'team-pulse',
    };
    const token = jwt.sign(payload, TEAM_JWT_SECRET(), { expiresIn: '24h' });

    return {
      token,
      subjectId,
      returning: Boolean(existing),
      consent: { scopeId: TEAM_CONSENT_SCOPE, researchAllowed: true },
      member: this.publicMember(member),
    };
  }

  async me(auth: TeamTokenPayload) {
    const member = await this.repository.findById(auth.sub);
    if (!member) throw new NotFoundException('unknown_member');
    return { member: this.publicMember(member), subjectId: auth.subjectId };
  }

  // ── Ingesta (proxy con autorización de sujeto) ──────────────────────────

  /**
   * Cierra la brecha de autorización de la API dala genérica: aquí el
   * subjectId de CADA evento se verifica contra el del token. Nadie emite
   * a nombre de otro.
   */
  async ingestBatch(auth: TeamTokenPayload, events: Array<DalaBehaviorEvent | DalaEventV2>) {
    if (!Array.isArray(events) || events.length === 0) return [];
    if (events.length > 200) throw new BadRequestException('batch_too_large');
    for (const event of events) {
      if (event?.subjectId !== auth.subjectId) {
        throw new ForbiddenException('subject_mismatch');
      }
    }
    const v2 = events.filter((e): e is DalaEventV2 => e.schemaVersion === DALA_EVENT_SCHEMA_V2);
    const v1 = events.filter((e): e is DalaBehaviorEvent => e.schemaVersion !== DALA_EVENT_SCHEMA_V2);
    return [...(await this.dala.ingestBatchV2(v2)), ...(await this.dala.ingestBatch(v1))];
  }

  // ── Declarado (nunca se mezcla con evidencia conductual) ────────────────

  async saveDeclared(auth: TeamTokenPayload, declared: DeclaredProfile) {
    // Se fusiona con lo ya declarado: cada pantalla aporta su parte sin
    // pisar a las demás (portal al inicio, revisión del estado al final).
    const member = await this.repository.findById(auth.sub);
    const prior = (member?.declared_json ?? {}) as DeclaredProfile;
    const clean: DeclaredProfile = {
      ...prior,
      ...(declared.entryMode !== undefined ? { entryMode: declared.entryMode } : {}),
      ...(declared.portal !== undefined ? { portal: declared.portal } : {}),
      ...(declared.area !== undefined ? { area: declared.area } : {}),
      ...(declared.ageBand !== undefined ? { ageBand: declared.ageBand } : {}),
      ...(declared.workRhythm !== undefined ? { workRhythm: declared.workRhythm } : {}),
      ...(declared.feedbackMode !== undefined ? { feedbackMode: declared.feedbackMode } : {}),
      ...(declared.stateReview !== undefined ? { stateReview: declared.stateReview } : {}),
      ...(declared.shareConditions !== undefined
        ? { shareConditions: declared.shareConditions !== false }
        : {}),
    };
    await this.repository.saveDeclared(auth.sub, clean as object);
    return { saved: true, declared: clean };
  }

  /** Nombres de la Estrella generativa (una por dimensión dominante). */
  private static readonly STAR_NAMES = [
    'Estrella del Rigor',
    'Estrella Persistente',
    'Estrella Vincular',
    'Estrella Mutante',
    'Estrella Presente',
  ];

  async complete(auth: TeamTokenPayload, archetype?: string) {
    if (
      archetype &&
      !TEAM_ARCHETYPES.includes(archetype as TeamArchetype) &&
      !TeamService.STAR_NAMES.includes(archetype)
    ) {
      throw new BadRequestException('unknown_archetype');
    }
    const member = await this.repository.markCompleted(auth.sub, archetype);
    return { member: this.publicMember(member) };
  }

  // ── Ciclo D.A.L.A. (Modelo Fundacional 0.1) ─────────────────────────────
  // Instantánea → decisión del catálogo → veredicto humano → contenido
  // asignado → resultado de contraste → nueva instantánea encadenada.

  decide(auth: TeamTokenPayload) {
    return this.dala.decideV2(auth.subjectId);
  }

  async review(
    auth: TeamTokenPayload,
    decisionId: string,
    verdict: 'approved' | 'rejected' | 'edited',
    reason?: string,
    chosen?: string,
  ) {
    await this.assertOwnDecision(auth, decisionId);
    return this.dala.reviewV2(decisionId, verdict, chosen, reason);
  }

  async recordOutcome(
    auth: TeamTokenPayload,
    input: { decisionId: string; interventionId: string; metrics: Record<string, unknown> },
  ) {
    await this.assertOwnDecision(auth, input.decisionId);
    return this.dala.recordOutcome(input);
  }

  /** De una afirmación propia a los eventos que la sostienen. */
  traceClaim(auth: TeamTokenPayload, claimKey: string) {
    return this.dala.traceClaimV2(auth.subjectId, claimKey);
  }

  /** La persona puede descargar sus propios datos seudónimos (§20). */
  exportOwn(auth: TeamTokenPayload) {
    return this.dala.exportV2(auth.subjectId);
  }

  replayCheck(auth: TeamTokenPayload) {
    return this.dala.replayCheckV2(auth.subjectId);
  }

  private async assertOwnDecision(auth: TeamTokenPayload, decisionId: string) {
    const decisions = await this.dala.decisionsFor(auth.subjectId, 100);
    if (!decisions.some((d) => d.decision_id === decisionId)) {
      throw new ForbiddenException('not_your_decision');
    }
  }

  // ── Retrato trazable ────────────────────────────────────────────────────

  /**
   * El retrato de una persona: la instantánea vigente proyectada desde su
   * registro, lo declarado (separado de lo observado) y sus decisiones.
   * Las etiquetas de ámbitos y escenas vienen del marco versionado.
   */
  async report(auth: TeamTokenPayload) {
    return this.reportFor(auth.sub, auth.subjectId);
  }

  private async reportFor(memberId: string, subjectId: string) {
    const member = await this.repository.findById(memberId);
    if (!member) throw new NotFoundException('unknown_member');
    const snapshot = await this.dala.snapshotV2(subjectId);
    const decisions = await this.dala.decisionsFor(subjectId, 5);
    const outcomes = await Promise.all(decisions.map((d) => this.dala.outcomesFor(d.decision_id)));
    const fw = this.dala.framework;
    return {
      member: this.publicMember(member),
      subjectId,
      declared: (member.declared_json ?? {}) as DeclaredProfile,
      snapshot,
      framework: {
        version: fw.version,
        ambitos: fw.ambitos,
        skills: fw.skills,
        scenes: fw.scenes.map((s) => ({ id: s.id, title: s.title })),
        decisions: fw.decisions.map((d) => ({ id: d.id, label: d.label, purpose: d.purpose })),
        constructs: fw.constructs.map((c) => ({
          id: c.id,
          name: c.name,
          question: c.question,
          limits: c.limits,
          sufficiency: c.sufficiency,
        })),
      },
      decisions: decisions.map((d, i) => ({
        decisionId: d.decision_id,
        objective: d.objective,
        selectedAction: d.selected_action,
        reasons: d.reasons,
        policyVersion: d.policy_version,
        humanVerdict: d.human_verdict,
        humanVerdictReason: d.human_verdict_reason,
        expectedOutcome: d.expected_outcome,
        stateSnapshotId: d.state_snapshot_id,
        createdAt: d.created_at,
        outcome: (outcomes[i].at(-1)?.metrics ?? null) as Record<string, unknown> | null,
      })),
    };
  }

  // ── Vista de investigación (X-Team-Admin-Code) ──────────────────────────

  private async subjectOfMember(memberId: string) {
    const member = await this.repository.findById(memberId);
    if (!member) throw new NotFoundException('unknown_member');
    const { subjectId } = await this.dala.resolveSubject(member.member_id);
    return subjectId;
  }

  async adminReport(memberId: string) {
    return this.reportFor(memberId, await this.subjectOfMember(memberId));
  }

  async adminTrace(memberId: string, claimKey: string) {
    return this.dala.traceClaimV2(await this.subjectOfMember(memberId), claimKey);
  }

  async adminExport(memberId: string) {
    return this.dala.exportV2(await this.subjectOfMember(memberId));
  }

  async adminReplay(memberId: string) {
    return this.dala.replayCheckV2(await this.subjectOfMember(memberId));
  }

  // ── Administración ──────────────────────────────────────────────────────

  async createInvites(people: Array<{ name?: string; email?: string; roleLabel?: string }>) {
    if (!Array.isArray(people) || people.length === 0) {
      throw new BadRequestException('empty_invite_list');
    }
    const created = await this.repository.createInvites(people);
    return created.map((m) => ({
      inviteCode: m.invite_code,
      name: m.name,
      email: m.email,
      roleLabel: m.role_label,
    }));
  }

  /** Vista de equipo. Respeta shareConditions: sin permiso, sin condiciones. */
  async listMembers() {
    const members = await this.repository.listMembers();
    return members.map((m) => {
      const declared = (m.declared_json ?? {}) as DeclaredProfile;
      const shared = declared.shareConditions !== false;
      return {
        ...this.publicMember(m),
        inviteCode: m.invite_code,
        email: m.email,
        declared: shared
          ? { area: declared.area, portal: declared.portal }
          : 'la persona decidió no compartirlo',
      };
    });
  }

  // ── Estrella IA (opcional) ──────────────────────────────────────────────

  /**
   * Ilustración de la estrella con Gemini (nano banana) cuando hay key.
   * La SVG paramétrica del cliente es el camino principal; esto es el extra.
   */
  async generateStarImage(auth: TeamTokenPayload, archetype: TeamArchetype) {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException('ai_star_not_configured');
    }
    if (!TEAM_ARCHETYPES.includes(archetype)) {
      throw new BadRequestException('unknown_archetype');
    }
    const meta = ARCHETYPE_META[archetype];
    const prompt = [
      'Crea una ilustración digital 2D de una estrella antropomórfica del universo Synapxix.',
      'Estilo: flat design, formas redondeadas, amables y simples, inspirado en el diseño oficial de Synapxix.',
      'Color predominante: azul brillante #1B95FB. Fondo con degradado azul claro o celeste suave, sin texto ni logotipos.',
      'Ojos grandes y expresivos, sonrisa cálida, cuerpo flexible o flotante. Iluminación sutil, energía positiva.',
      `Arquetipo: ${meta.label} — ${meta.mood}; acentos en ${meta.accentA} y ${meta.accentB}.`,
      'Resolución cuadrada 1:1, fondo limpio, sin bordes.',
    ].join(' ');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      },
    );
    if (!response.ok) {
      throw new ServiceUnavailableException(`ai_star_failed_${response.status}`);
    }
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> } }>;
    };
    const image = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
    if (!image) throw new ServiceUnavailableException('ai_star_empty');
    return { mimeType: image.mimeType, base64: image.data, archetype, label: meta.label };
  }

  private publicMember(m: {
    member_id: string;
    name: string | null;
    role_label: string | null;
    status: string;
    archetype: string | null;
    joined_at: Date | null;
    completed_at: Date | null;
  }) {
    return {
      memberId: m.member_id,
      name: m.name,
      roleLabel: m.role_label,
      status: m.status,
      archetype: m.archetype,
      joinedAt: m.joined_at,
      completedAt: m.completed_at,
    };
  }
}
