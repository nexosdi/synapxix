import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';

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
      },
    });
  }
}
