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
   * Capa narrativa del reporte (maestro §5.2): toda lectura viaja con sus
   * explicaciones alternativas no descartadas y su próxima validación.
   * Es interpretación acotada del contexto del pulso — nunca entra al motor.
   */
  private static readonly CONSTRUCT_NARRATIVE: Record<
    string,
    { alternatives: string[]; nextValidation: string }
  > = {
    curricular_mastery: {
      alternatives: [
        'El contenido era sobre Synapxix mismo: familiaridad previa puede inflar la lectura.',
        'Una sola jornada con herramienta nueva: efecto novedad no descartado.',
      ],
      nextValidation: 'Repetir la señal con material nuevo, sin pistas, en otra sesión.',
    },
    persistence: {
      alternatives: [
        'Los retos son cortos: la persistencia de horas o días no está observada.',
        'El contexto era de bajo riesgo: insistir no costaba nada.',
      ],
      nextValidation: 'Observar la reacción al primer bloqueo real que dure más de un día.',
    },
    help_seeking: {
      alternatives: [
        'Pedir poca ayuda puede ser dominio alto, no evitación.',
        'Pedir mucha puede ser exploración de la interfaz, no dependencia.',
      ],
      nextValidation: 'Ver si el apoyo llega a tiempo en la primera tarea con presión real.',
    },
    strategy_flexibility: {
      alternatives: [
        'Cambiar de enfoque pudo ser curiosidad por la interfaz, no estrategia.',
        'No cambiar pudo significar que el primer enfoque alcanzaba.',
      ],
      nextValidation: 'Confirmar ante un problema real que exija abandonar un camino invertido.',
    },
    task_engagement: {
      alternatives: [
        'Completar una experiencia guiada y única no equivale a retorno voluntario.',
      ],
      nextValidation: 'El retorno voluntario se observa recién en las próximas semanas de trabajo.',
    },
  };

  /**
   * El reporte completo de una persona: estado D.A.L.A. real (con
   * incertidumbre, alternativas y próxima validación), rigor observacional
   * del caso, actividad, lo declarado, decisiones shadow con veredicto y
   * la afinidad narrativa de arquetipos.
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

    // Rigor observacional: desempeño en el caso (tareas caso-*), donde la
    // persona separó observado de inferido y decidió como la política.
    let caseAnswers = 0;
    let caseCorrect = 0;
    for (const event of timeline as Array<{
      event_type: string;
      context_json: unknown;
      payload_json: unknown;
    }>) {
      if (event.event_type !== 'answer_submitted') continue;
      const taskId = (event.context_json as { taskId?: string })?.taskId ?? '';
      if (!taskId.startsWith('caso-')) continue;
      caseAnswers += 1;
      if ((event.payload_json as { correct?: boolean })?.correct === true) caseCorrect += 1;
    }
    const rigor =
      caseAnswers === 0
        ? null
        : {
            answers: caseAnswers,
            correct: caseCorrect,
            accuracy: Math.round((caseCorrect / caseAnswers) * 100) / 100,
            reading:
              caseCorrect / caseAnswers >= 0.8
                ? 'Distinguiste observación de inferencia con soltura, y elegiste ayuda mínima.'
                : caseCorrect / caseAnswers >= 0.5
                  ? 'El criterio está en construcción: algunas lecturas pidieron más evidencia de la que había.'
                  : 'La tentación de sobreinferir apareció seguido — el detector de test disfrazado es para practicarlo.',
          };

    const constructs = Object.fromEntries(
      Object.entries(state.constructs).map(([id, reading]) => [
        id,
        {
          ...(reading as object),
          alternatives: TeamService.CONSTRUCT_NARRATIVE[id]?.alternatives ?? [],
          nextValidation: TeamService.CONSTRUCT_NARRATIVE[id]?.nextValidation ?? null,
        },
      ]),
    );

    const declared = (member.declared_json ?? {}) as DeclaredProfile;
    const affinities = computeArchetypeAffinity(
      declared,
      state.constructs as Parameters<typeof computeArchetypeAffinity>[1],
    );

    return {
      member: this.publicMember(member),
      subjectId: auth.subjectId,
      constructs,
      rigor,
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
