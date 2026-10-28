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

/**
 * Versión del consentimiento del Primer Pulso. v3 (revisión de la
 * bienvenida, 28-oct): una sola autorización, obligatoria para entrar, que
 * cubre operar la experiencia y el registro para D.A.L.A. Perfil visible y
 * documentos con IA quedan sin autorizar hasta que se pidan por separado.
 */
export const TEAM_CONSENT_SCOPE = 'team-primer-pulso-v3';

/** Lo que la persona acepta al continuar. */
export interface ConsentChoice {
  accepted?: boolean;
}

/** Registro versionado de lo autorizado. Retirar = guardar uno nuevo. */
export interface ConsentRecord {
  scopeId: string;
  operation: true;
  research: boolean;
  profile: boolean;
  documentsAi: boolean;
  decidedAt: string;
}

/** CV y enlaces: autorización propia, distinta del registro para D.A.L.A. */
export const TEAM_DOCUMENTS_SCOPE = 'team-perfil-profesional-v1';
const CV_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]);
const CV_MAX_BYTES = 5 * 1024 * 1024;

export interface ProfileDocumentsInput {
  consent?: boolean;
  cv?: { filename?: string; mime?: string; base64?: string };
  links?: string[];
}

/** Solo textos cortos y listas acotadas: el perfil es declarado, no un documento. */
function sanitizePerfil(p: NonNullable<DeclaredProfile['perfil']>): NonNullable<DeclaredProfile['perfil']> {
  const short = (v: unknown) => (typeof v === 'string' ? v.slice(0, 80) : undefined);
  return {
    ...(Array.isArray(p.superpoderes) ? { superpoderes: p.superpoderes.slice(0, 3).map((x) => String(x).slice(0, 40)) } : {}),
    ...(short(p.aprender) ? { aprender: short(p.aprender) } : {}),
    ...(short(p.motivacion) ? { motivacion: short(p.motivacion) } : {}),
    ...(p.trabajo && typeof p.trabajo === 'object'
      ? { trabajo: Object.fromEntries(Object.entries(p.trabajo).slice(0, 8).map(([k, v]) => [k.slice(0, 30), String(v).slice(0, 80)])) }
      : {}),
    ...(p.reunion && short(p.reunion.dia) && short(p.reunion.horario)
      ? { reunion: { dia: short(p.reunion.dia)!.slice(0, 20), horario: short(p.reunion.horario)!.slice(0, 20) } }
      : {}),
  };
}

/** Sin aceptación no hay entrada: no existe un recorrido sin registro. */
function consentRecord(choice: ConsentChoice | undefined): ConsentRecord {
  if (choice?.accepted !== true) throw new BadRequestException('consent_required');
  return {
    scopeId: TEAM_CONSENT_SCOPE,
    operation: true,
    research: true,
    profile: false,
    documentsAi: false,
    decidedAt: new Date().toISOString(),
  };
}

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

  async join(inviteCode: string, name?: string, roleLabel?: string, consent?: ConsentChoice) {
    const member = await this.repository.findByInviteCode(inviteCode?.trim()?.toUpperCase() ?? '');
    if (!member) throw new NotFoundException('unknown_invite_code');

    const record = consentRecord(consent);
    const updated = await this.repository.markJoined(member.member_id, name, roleLabel);
    await this.repository.saveConsent(member.member_id, record);
    // El seudónimo se resuelve igual que para cualquier usuario: mapeo en auth.
    const { subjectId } = await this.dala.resolveSubject(member.member_id);

    return {
      token: this.sign(member.member_id, subjectId, updated.name, record),
      subjectId,
      consent: { scopeId: record.scopeId, researchAllowed: record.research },
      member: this.publicMember(updated),
    };
  }

  /**
   * Inscripción abierta (onboarding web): nombre + email + edad + área, sin
   * código. Idempotente por email — la misma persona que vuelve recupera su
   * miembro y su seudónimo, y su modelo dinámico ACUMULA entre sesiones.
   * Se desactiva con TEAM_OPEN_REGISTRATION=0.
   */
  async register(input: { name?: string; email?: string; age?: number; area?: string; consent?: ConsentChoice }) {
    if (process.env['TEAM_OPEN_REGISTRATION'] === '0') {
      throw new ForbiddenException('open_registration_disabled');
    }
    const name = input.name?.trim() ?? '';
    const email = input.email?.trim().toLowerCase() ?? '';
    const age = Number(input.age);
    if (name.length < 2) throw new BadRequestException('invalid_name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('invalid_email');
    // Edad libre: solo se verifica que sea un número entero positivo.
    if (!Number.isInteger(age) || age < 1) throw new BadRequestException('invalid_age');
    const record = consentRecord(input.consent);

    const existing = await this.repository.findByEmail(email);
    const member = existing
      ? await this.repository.markJoined(existing.member_id, name, input.area)
      : await this.repository.createOpen({ name, email, roleLabel: input.area });

    // Cada entrada vuelve a preguntar: la última aceptación es la vigente.
    await this.repository.saveConsent(member.member_id, record);
    // Edad y área quedan en lo declarado: la ficha del equipo las muestra.
    const prior = (member.declared_json ?? {}) as DeclaredProfile;
    await this.repository.saveDeclared(member.member_id, {
      ...prior,
      edad: age,
      ...(input.area ? { area: input.area.slice(0, 120) } : {}),
    } as object);

    const { subjectId } = await this.dala.resolveSubject(member.member_id);
    return {
      token: this.sign(member.member_id, subjectId, member.name, record),
      subjectId,
      returning: Boolean(existing),
      consent: { scopeId: record.scopeId, researchAllowed: record.research },
      member: this.publicMember(member),
    };
  }

  private sign(memberId: string, subjectId: string, name: string | null, consent: ConsentRecord) {
    const payload: TeamTokenPayload = {
      sub: memberId,
      subjectId,
      name: name ?? 'pulso',
      scope: 'team-pulse',
      research: consent.research,
    };
    return jwt.sign(payload, TEAM_JWT_SECRET(), { expiresIn: '24h' });
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
    // Sin la finalidad de investigación no existe registro analítico personal.
    if (auth.research === false) throw new ForbiddenException('research_not_consented');
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

  // ── Perfil profesional: CV y enlaces (nunca entran a D.A.L.A.) ──────────

  /**
   * Guarda el CV (PDF o Word, hasta 5 MB) y enlaces profesionales con su
   * autorización específica. No se analizan con IA ni se usan para evaluar.
   */
  async saveProfileDocuments(auth: TeamTokenPayload, input: ProfileDocumentsInput) {
    if (input?.consent !== true) throw new BadRequestException('consent_required');
    const docs: Array<{ kind: 'cv' | 'link'; filename?: string; mime?: string; size?: number; data?: Buffer; url?: string }> = [];

    if (input.cv?.base64) {
      const mime = input.cv.mime ?? '';
      if (!CV_TYPES.has(mime)) throw new BadRequestException('unsupported_file_type');
      const data = Buffer.from(input.cv.base64, 'base64');
      if (data.length === 0 || data.length > CV_MAX_BYTES) throw new BadRequestException('file_too_large');
      const filename = (input.cv.filename ?? 'cv').replace(/[^\w.\- áéíóúñÁÉÍÓÚÑ]/g, '_').slice(0, 200);
      docs.push({ kind: 'cv', filename, mime, size: data.length, data });
    }
    for (const raw of (input.links ?? []).slice(0, 5)) {
      const url = raw?.trim();
      if (!url) continue;
      if (!/^https?:\/\/\S+$/i.test(url) || url.length > 500) throw new BadRequestException('invalid_link');
      docs.push({ kind: 'link', url });
    }
    if (!docs.length) throw new BadRequestException('nothing_to_save');

    const consent = {
      scopeId: TEAM_DOCUMENTS_SCOPE,
      purpose: 'conocer el perfil profesional dentro del equipo',
      aiAnalysis: false,
      decidedAt: new Date().toISOString(),
    };
    const saved = await this.repository.saveDocuments(auth.sub, docs, consent);
    return { saved: saved.length, cv: docs.some((d) => d.kind === 'cv'), links: docs.filter((d) => d.kind === 'link').length };
  }

  /**
   * Retirar a una participante: primero su registro D.A.L.A. (eventos y todo
   * lo derivado), después su CV, enlaces y ficha. Para pruebas y para cumplir
   * un pedido de retiro de datos.
   */
  async removeMember(memberId: string) {
    const { events } = await this.dala.forgetSubject(memberId);
    const removed = await this.repository.deleteMember(memberId);
    if (!removed) throw new NotFoundException('unknown_member');
    return { removed: true, events };
  }

  async adminDocuments(memberId: string) {
    const docs = await this.repository.listDocuments(memberId);
    return docs.map((d) => ({
      documentId: d.document_id,
      kind: d.kind,
      filename: d.filename,
      mime: d.mime,
      size: d.size,
      url: d.url,
      createdAt: d.created_at,
    }));
  }

  async adminDocument(memberId: string, documentId: string) {
    const doc = await this.repository.findDocument(memberId, documentId);
    if (!doc?.data) throw new NotFoundException('unknown_document');
    return { filename: doc.filename ?? 'cv', mime: doc.mime ?? 'application/octet-stream', data: Buffer.from(doc.data) };
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
      ...(declared.perfil !== undefined ? { perfil: sanitizePerfil({ ...prior.perfil, ...declared.perfil }) } : {}),
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
  async report(auth: TeamTokenPayload, since?: string) {
    return this.reportFor(auth.sub, auth.subjectId, since);
  }

  /**
   * @param since instantánea de referencia (la "A", tomada al terminar de
   * aprender D.A.L.A.): el retrato la devuelve como `baseline` para mostrar
   * qué cambió con las misiones. Solo se aceptan instantáneas del sujeto.
   */
  private async reportFor(memberId: string, subjectId: string, since?: string) {
    const member = await this.repository.findById(memberId);
    if (!member) throw new NotFoundException('unknown_member');
    const snapshot = await this.dala.snapshotV2(subjectId);
    const baseline = since ? await this.dala.snapshotByIdV2(subjectId, since) : null;
    const decisions = await this.dala.decisionsFor(subjectId, 5);
    const outcomes = await Promise.all(decisions.map((d) => this.dala.outcomesFor(d.decision_id)));
    const fw = this.dala.framework;
    return {
      member: this.publicMember(member),
      subjectId,
      declared: (member.declared_json ?? {}) as DeclaredProfile,
      snapshot,
      baseline: baseline
        ? {
            snapshotId: baseline.snapshotId,
            createdAt: baseline.createdAt,
            claims: baseline.claims.map((c) => ({
              key: c.key,
              numerator: c.observation.numerator,
              denominator: c.observation.denominator,
              evidenceStatus: c.evidenceStatus,
            })),
          }
        : null,
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
        createdAt: m.created_at,
        declared: shared
          ? { area: declared.area, edad: declared.edad, portal: declared.portal, perfil: declared.perfil }
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
