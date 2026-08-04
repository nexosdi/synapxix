import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DalaFacade } from '../dala/dala.facade';
import { TeamRepository } from './team.repository';
import { TEAM_JWT_SECRET, TeamTokenPayload } from './team-auth.guard';
import {
  ARCHETYPE_META,
  computeArchetypeAffinity,
  DeclaredProfile,
  TEAM_ARCHETYPES,
  TeamArchetype,
} from './archetype';

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
  async ingestBatch(auth: TeamTokenPayload, events: DalaBehaviorEvent[]) {
    if (!Array.isArray(events) || events.length === 0) return [];
    if (events.length > 200) throw new BadRequestException('batch_too_large');
    for (const event of events) {
      if (event?.subjectId !== auth.subjectId) {
        throw new ForbiddenException('subject_mismatch');
      }
    }
    return this.dala.ingestBatch(events);
  }

  // ── Declarado (nunca se mezcla con evidencia conductual) ────────────────

  async saveDeclared(auth: TeamTokenPayload, declared: DeclaredProfile) {
    const clean: DeclaredProfile = {
      entryMode: declared.entryMode,
      workRhythm: declared.workRhythm,
      feedbackMode: declared.feedbackMode,
      shareConditions: declared.shareConditions !== false,
    };
    await this.repository.saveDeclared(auth.sub, clean as object);
    return { saved: true, declared: clean };
  }

  async complete(auth: TeamTokenPayload, archetype?: string) {
    if (archetype && !TEAM_ARCHETYPES.includes(archetype as TeamArchetype)) {
      throw new BadRequestException('unknown_archetype');
    }
    const member = await this.repository.markCompleted(auth.sub, archetype);
    return { member: this.publicMember(member) };
  }

  // ── Ciclo D.A.L.A. propio (decisión shadow → review → outcome → traza) ──

  decide(auth: TeamTokenPayload) {
    return this.dala.decide(auth.subjectId);
  }

  async review(
    auth: TeamTokenPayload,
    decisionId: string,
    verdict: 'approved' | 'rejected' | 'edited',
    reason?: string,
  ) {
    await this.assertOwnDecision(auth, decisionId);
    return this.dala.review(decisionId, verdict, reason);
  }

  async recordOutcome(
    auth: TeamTokenPayload,
    input: { decisionId: string; interventionId: string; metrics: Record<string, unknown> },
  ) {
    await this.assertOwnDecision(auth, input.decisionId);
    return this.dala.recordOutcome(input);
  }

  async trace(auth: TeamTokenPayload, decisionId: string) {
    await this.assertOwnDecision(auth, decisionId);
    return this.dala.getTrace(decisionId);
  }

  private async assertOwnDecision(auth: TeamTokenPayload, decisionId: string) {
    const decisions = await this.dala.decisionsFor(auth.subjectId, 100);
    if (!decisions.some((d) => d.decision_id === decisionId)) {
      throw new ForbiddenException('not_your_decision');
    }
  }

  // ── Modelado por persona ────────────────────────────────────────────────

  /**
   * El reporte completo de una persona: estado D.A.L.A. real (con
   * incertidumbre y estados de validez), actividad, lo declarado, la última
   * decisión shadow con su veredicto, y la afinidad narrativa de arquetipos.
   */
  async report(auth: TeamTokenPayload) {
    const member = await this.repository.findById(auth.sub);
    if (!member) throw new NotFoundException('unknown_member');

    const state = await this.dala.getState(auth.subjectId);
    const timeline = await this.dala.getTimeline(auth.subjectId);
    const decisions = await this.dala.decisionsFor(auth.subjectId, 5);

    const byType: Record<string, number> = {};
    const sessions = new Set<string>();
    for (const event of timeline as Array<{ event_type: string; session_id: string }>) {
      byType[event.event_type] = (byType[event.event_type] ?? 0) + 1;
      sessions.add(event.session_id);
    }

    const declared = (member.declared_json ?? {}) as DeclaredProfile;
    const affinities = computeArchetypeAffinity(
      declared,
      state.constructs as Parameters<typeof computeArchetypeAffinity>[1],
    );

    return {
      member: this.publicMember(member),
      subjectId: auth.subjectId,
      constructs: state.constructs,
      activity: { totalEvents: timeline.length, sessions: sessions.size, byType },
      declared,
      decisions: decisions.map((d) => ({
        decisionId: d.decision_id,
        objective: d.objective,
        selectedAction: d.selected_action,
        reasons: d.reasons,
        confidence: d.confidence,
        policyVersion: d.policy_version,
        requiresHumanApproval: d.requires_human_approval,
        humanVerdict: d.human_verdict,
        humanVerdictReason: d.human_verdict_reason,
        expectedOutcome: d.expected_outcome,
        createdAt: d.created_at,
      })),
      archetypes: affinities.map((a) => ({ ...a, meta: ARCHETYPE_META[a.archetype] })),
    };
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
          ? {
              entryMode: declared.entryMode,
              workRhythm: declared.workRhythm,
              feedbackMode: declared.feedbackMode,
            }
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
