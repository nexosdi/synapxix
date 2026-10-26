import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { Prisma } from '@prisma/client';
import {
  DALA_EVENT_SCHEMA_V2,
  type DalaBehaviorEvent,
  type DalaEventV2,
  type DalaSnapshotV2,
} from '@nexosdi.synapxix/dala/contracts';

/** UUID nulo para rangos vacíos (las columnas de rango son UUID). */
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * Acceso a datos del bounded context D.A.L.A.
 * Única pieza de Synapxix autorizada a tocar el schema `dala`.
 */
@Injectable()
export class DalaRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Inserta si no existe. Devuelve 'accepted' o 'duplicate' (idempotencia). */
  async appendEvent(event: DalaBehaviorEvent): Promise<'accepted' | 'duplicate'> {
    const existing = await this.prisma.dalaBehaviorEvent.findUnique({
      where: { event_id: event.eventId },
      select: { id: true },
    });
    if (existing) return 'duplicate';

    await this.prisma.dalaBehaviorEvent.create({
      data: {
        event_id: event.eventId,
        subject_id: event.subjectId,
        session_id: event.sessionId,
        event_type: event.eventType,
        sequence: event.sequence,
        occurred_at: new Date(event.occurredAt),
        instrument_id: event.source.instrumentId,
        instrument_version: event.source.instrumentVersion,
        schema_version: event.schemaVersion,
        context_json: event.context as object,
        payload_json: event.payload as object,
        consent_scope: event.consent.scopeId,
        research_allowed: event.consent.researchAllowed,
      },
    });
    return 'accepted';
  }

  /** Eventos de una sesión en orden de secuencia (contexto para las reglas). */
  async sessionEvents(sessionId: string): Promise<DalaBehaviorEvent[]> {
    const rows = await this.prisma.dalaBehaviorEvent.findMany({
      where: { session_id: sessionId },
      orderBy: { sequence: 'asc' },
    });
    return rows.map((r) => ({
      schemaVersion: 'dala.behavior-event.v1',
      eventId: r.event_id,
      subjectId: r.subject_id,
      sessionId: r.session_id,
      occurredAt: r.occurred_at.toISOString(),
      sequence: r.sequence,
      eventType: r.event_type as DalaBehaviorEvent['eventType'],
      source: {
        applicationId: 'stored',
        instrumentId: r.instrument_id,
        instrumentVersion: r.instrument_version,
      },
      context: r.context_json as DalaBehaviorEvent['context'],
      payload: r.payload_json as Record<string, unknown>,
      consent: { scopeId: r.consent_scope, researchAllowed: r.research_allowed },
    }));
  }

  async saveObservations(
    observations: Array<{
      subjectId: string;
      sessionId: string;
      sourceEventId: string;
      ruleId: string;
      ruleVersion: string;
      constructId: string;
      kind: string;
      weight: number;
      confidenceContribution: number;
      observedAt: string;
    }>,
  ) {
    if (observations.length === 0) return;
    await this.prisma.dalaEvidenceObservation.createMany({
      data: observations.map((o) => ({
        subject_id: o.subjectId,
        session_id: o.sessionId,
        source_event_id: o.sourceEventId,
        rule_id: o.ruleId,
        rule_version: o.ruleVersion,
        construct_id: o.constructId,
        kind: o.kind,
        weight: o.weight,
        confidence_contribution: o.confidenceContribution,
        observed_at: new Date(o.observedAt),
      })),
    });
  }

  async observationsFor(subjectId: string, constructId: string) {
    return this.prisma.dalaEvidenceObservation.findMany({
      where: { subject_id: subjectId, construct_id: constructId },
      orderBy: { observed_at: 'asc' },
    });
  }

  /** Tareas y sesiones distintas que respaldan un constructo (para umbrales). */
  async evidenceDiversity(subjectId: string, constructId: string) {
    const obs = await this.prisma.dalaEvidenceObservation.findMany({
      where: { subject_id: subjectId, construct_id: constructId },
      select: { session_id: true, source_event_id: true },
    });
    const events = await this.prisma.dalaBehaviorEvent.findMany({
      where: { event_id: { in: obs.map((o) => o.source_event_id) } },
      select: { context_json: true },
    });
    const tasks = new Set(
      events
        .map((e) => (e.context_json as { taskId?: string })?.taskId)
        .filter((t): t is string => Boolean(t)),
    );
    return {
      distinctSessions: new Set(obs.map((o) => o.session_id)).size,
      distinctTasks: tasks.size,
    };
  }

  async upsertEstimate(est: {
    subjectId: string;
    constructId: string;
    value: number;
    confidence: number;
    stability: number;
    status: string;
    uncertainty: object;
    evidenceCount: number;
    evidenceRefs: string[];
    validUntil?: string;
    modelVersion: string;
  }) {
    await this.prisma.dalaConstructEstimate.upsert({
      where: {
        subject_id_construct_id: { subject_id: est.subjectId, construct_id: est.constructId },
      },
      update: {
        value: est.value,
        confidence: est.confidence,
        stability: est.stability,
        status: est.status,
        uncertainty: est.uncertainty,
        evidence_count: est.evidenceCount,
        evidence_refs: est.evidenceRefs,
        expires_at: est.validUntil ? new Date(est.validUntil) : null,
        model_version: est.modelVersion,
      },
      create: {
        subject_id: est.subjectId,
        construct_id: est.constructId,
        value: est.value,
        confidence: est.confidence,
        stability: est.stability,
        status: est.status,
        uncertainty: est.uncertainty,
        evidence_count: est.evidenceCount,
        evidence_refs: est.evidenceRefs,
        expires_at: est.validUntil ? new Date(est.validUntil) : null,
        model_version: est.modelVersion,
      },
    });
  }

  async estimatesFor(subjectId: string) {
    return this.prisma.dalaConstructEstimate.findMany({ where: { subject_id: subjectId } });
  }

  async timeline(subjectId: string, limit = 200) {
    return this.prisma.dalaBehaviorEvent.findMany({
      where: { subject_id: subjectId },
      orderBy: { occurred_at: 'desc' },
      take: limit,
      select: {
        event_id: true,
        session_id: true,
        event_type: true,
        sequence: true,
        occurred_at: true,
        instrument_id: true,
        context_json: true,
        payload_json: true,
      },
    });
  }

  // ── Fases 3–5: seudónimos, snapshots, decisiones, outcomes, trazas ──────

  /** Resuelve (o crea) el subject_id seudónimo de un usuario. Vive en auth. */
  async resolveSubject(userId: string): Promise<string> {
    const row = await this.prisma.dalaSubjectMap.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId },
    });
    return row.subject_id;
  }

  async saveSnapshot(input: {
    subjectId: string;
    state: object;
    sourceEventFrom: string;
    sourceEventTo: string;
    modelVersion: string;
  }) {
    return this.prisma.dalaHumanStateSnapshot.create({
      data: {
        subject_id: input.subjectId,
        state_json: input.state,
        source_event_from: input.sourceEventFrom,
        source_event_to: input.sourceEventTo,
        model_version: input.modelVersion,
      },
    });
  }

  async latestSnapshot(subjectId: string) {
    return this.prisma.dalaHumanStateSnapshot.findFirst({
      where: { subject_id: subjectId },
      orderBy: { created_at: 'desc' },
    });
  }

  async saveDecision(input: {
    subjectId: string;
    objective: string;
    candidateActions: string[];
    selectedAction: string;
    reasons: object;
    stateSnapshotId: string;
    policyVersion: string;
    modelVersion: string;
    confidence: number;
    expectedOutcome?: object;
  }) {
    return this.prisma.dalaDecisionRecord.create({
      data: {
        subject_id: input.subjectId,
        objective: input.objective,
        candidate_actions: input.candidateActions,
        selected_action: input.selectedAction,
        reasons: input.reasons,
        state_snapshot_id: input.stateSnapshotId,
        policy_version: input.policyVersion,
        model_version: input.modelVersion,
        confidence: input.confidence,
        requires_human_approval: true, // shadow mode: siempre
        expected_outcome: input.expectedOutcome,
      },
    });
  }

  async getDecision(decisionId: string) {
    return this.prisma.dalaDecisionRecord.findUnique({ where: { decision_id: decisionId } });
  }

  /** Decisiones de un sujeto, más recientes primero (historial shadow-mode). */
  async decisionsBySubject(subjectId: string, limit = 20) {
    return this.prisma.dalaDecisionRecord.findMany({
      where: { subject_id: subjectId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /** Registra el veredicto humano SIN sobrescribir la decisión original. */
  async reviewDecision(decisionId: string, verdict: string, reason?: string) {
    return this.prisma.dalaDecisionRecord.update({
      where: { decision_id: decisionId },
      data: { human_verdict: verdict, human_verdict_reason: reason ?? null },
    });
  }

  async saveOutcome(input: {
    decisionId: string;
    interventionId: string;
    subjectId: string;
    metrics: object;
    observedAt: string;
  }) {
    return this.prisma.dalaOutcome.create({
      data: {
        decision_id: input.decisionId,
        intervention_id: input.interventionId,
        subject_id: input.subjectId,
        metrics: input.metrics,
        observed_at: new Date(input.observedAt),
      },
    });
  }

  async outcomesFor(decisionId: string) {
    return this.prisma.dalaOutcome.findMany({ where: { decision_id: decisionId } });
  }

  async getSnapshot(snapshotId: string) {
    return this.prisma.dalaHumanStateSnapshot.findUnique({ where: { snapshot_id: snapshotId } });
  }

  async observationsBySubject(subjectId: string) {
    return this.prisma.dalaEvidenceObservation.findMany({
      where: { subject_id: subjectId },
      orderBy: { observed_at: 'asc' },
    });
  }

  // ── Modelo Fundacional 0.1: eventos v2 e instantáneas proyectadas ───────

  /**
   * Inserta un evento v2 en el mismo registro inmutable. Escena, oportunidad
   * y origen viajan en `context_json`; la escena ocupa el lugar del
   * instrumento. Un choque de (sesión, secuencia) con otro eventId es un
   * error de emisor: se informa, no se pisa.
   */
  async appendEventV2(event: DalaEventV2): Promise<'accepted' | 'duplicate' | 'sequence_conflict'> {
    const existing = await this.prisma.dalaBehaviorEvent.findUnique({
      where: { event_id: event.eventId },
      select: { id: true },
    });
    if (existing) return 'duplicate';
    try {
      await this.prisma.dalaBehaviorEvent.create({
        data: {
          event_id: event.eventId,
          subject_id: event.subjectId,
          session_id: event.sessionId,
          event_type: event.eventType,
          sequence: event.sequence,
          occurred_at: new Date(event.occurredAt),
          instrument_id: event.scene.id,
          instrument_version: event.scene.version,
          schema_version: event.schemaVersion,
          context_json: {
            ...event.context,
            scene: event.scene,
            opportunity: event.opportunity ?? null,
            origin: event.origin,
            source: event.source,
          } as object,
          payload_json: event.payload as object,
          consent_scope: event.consent.scopeId,
          research_allowed: event.consent.researchAllowed,
        },
      });
      return 'accepted';
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return 'sequence_conflict';
      }
      throw error;
    }
  }

  /** Todo el registro v2 de un sujeto, reconstruido al contrato original. */
  async eventsV2ForSubject(subjectId: string): Promise<DalaEventV2[]> {
    const rows = await this.prisma.dalaBehaviorEvent.findMany({
      where: { subject_id: subjectId, schema_version: DALA_EVENT_SCHEMA_V2 },
      orderBy: [{ occurred_at: 'asc' }, { sequence: 'asc' }],
    });
    return rows.map((r) => {
      const ctx = r.context_json as Record<string, unknown>;
      const { scene, opportunity, origin, source, ...context } = ctx as {
        scene: DalaEventV2['scene'];
        opportunity: DalaEventV2['opportunity'] | null;
        origin: DalaEventV2['origin'];
        source: DalaEventV2['source'];
      } & Record<string, unknown>;
      return {
        schemaVersion: DALA_EVENT_SCHEMA_V2,
        eventId: r.event_id,
        subjectId: r.subject_id,
        sessionId: r.session_id,
        occurredAt: r.occurred_at.toISOString(),
        sequence: r.sequence,
        eventType: r.event_type as DalaEventV2['eventType'],
        origin,
        source,
        scene,
        ...(opportunity ? { opportunity } : {}),
        context: context as DalaEventV2['context'],
        payload: r.payload_json as Record<string, unknown>,
        consent: { scopeId: r.consent_scope, researchAllowed: r.research_allowed },
      };
    });
  }

  /** Instantáneas del motor de proyección, de la más reciente a la más antigua. */
  snapshotsV2(subjectId: string, engineVersion: string, take = 50) {
    return this.prisma.dalaHumanStateSnapshot.findMany({
      where: { subject_id: subjectId, model_version: engineVersion },
      orderBy: { created_at: 'desc' },
      take,
    });
  }

  /** Persiste una instantánea con id propio: las afirmaciones lo usan en su claimId. */
  saveSnapshotV2(snapshotId: string, snapshot: DalaSnapshotV2) {
    return this.prisma.dalaHumanStateSnapshot.create({
      data: {
        snapshot_id: snapshotId,
        subject_id: snapshot.subjectId,
        state_json: snapshot as unknown as object,
        source_event_from: snapshot.eventRange.from ?? NIL_UUID,
        source_event_to: snapshot.eventRange.to ?? NIL_UUID,
        model_version: snapshot.engineVersion,
      },
    });
  }
}
