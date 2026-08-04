import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  DALA_EVENT_TYPES,
  DALA_EVENT_SCHEMA_VERSION,
  type DalaBehaviorEvent,
  type DalaIngestResult,
} from '@nexosdi.synapxix/dala/contracts';
import {
  CONSTRUCT_REGISTRY,
  DALA_MODEL_VERSION,
  DALA_POLICY_VERSION,
  decideNextAction,
  deriveEvidence,
  estimateConstruct,
} from '@nexosdi.synapxix/dala/domain';
import { DalaRepository } from './dala.repository';

/**
 * Fachada D.A.L.A. — el único punto por el que Synapxix habla con el motor.
 *
 * Ingesta: valida → persiste (append-only, idempotente) → ACK.
 * Procesamiento: deriva evidencia con reglas versionadas y reestima los
 * constructos afectados. Hoy corre en el mismo proceso tras el ACK; el
 * contrato ya separa ambas fases para mover el procesamiento a una cola
 * (BullMQ/Redis) sin tocar a los emisores.
 */
@Injectable()
export class DalaFacade {
  private readonly logger = new Logger('DALA');

  constructor(private readonly repository: DalaRepository) {}

  async ingest(event: DalaBehaviorEvent): Promise<DalaIngestResult> {
    const invalid = this.validate(event);
    if (invalid) return { eventId: event.eventId ?? 'unknown', status: 'rejected', reason: invalid };

    if (!event.consent?.scopeId) {
      return { eventId: event.eventId, status: 'quarantined', reason: 'missing_consent_scope' };
    }

    const status = await this.repository.appendEvent(event);
    if (status === 'duplicate') return { eventId: event.eventId, status: 'duplicate' };

    // Procesamiento post-ACK. Errores aquí no afectan la ingesta: el evento
    // ya es inmutable y la evidencia puede rederivarse (replay).
    try {
      await this.processEvidence(event);
    } catch (error) {
      this.logger.error(`evidence processing failed for ${event.eventId}: ${error}`);
    }

    return { eventId: event.eventId, status: 'accepted' };
  }

  async ingestBatch(events: DalaBehaviorEvent[]): Promise<DalaIngestResult[]> {
    const results: DalaIngestResult[] = [];
    for (const event of events) results.push(await this.ingest(event));
    return results;
  }

  /** Estado del sujeto: estimaciones vigentes con su evidencia y validez. */
  async getState(subjectId: string) {
    const estimates = await this.repository.estimatesFor(subjectId);
    return {
      subjectId,
      updatedAt: new Date().toISOString(),
      constructs: Object.fromEntries(
        estimates.map((e) => [
          e.construct_id,
          {
            value: e.value,
            confidence: e.confidence,
            stability: e.stability,
            status: e.status,
            uncertainty: e.uncertainty,
            evidenceCount: e.evidence_count,
            validUntil: e.expires_at?.toISOString() ?? null,
            modelVersion: e.model_version,
          },
        ]),
      ),
    };
  }

  async getTimeline(subjectId: string) {
    return this.repository.timeline(subjectId);
  }


  // ── Fases 3–5 ───────────────────────────────────────────────────────────

  /** Seudónimo del usuario autenticado. El mapeo vive en auth, no en dala. */
  resolveSubject(userId: string) {
    return this.repository.resolveSubject(userId).then((subjectId) => ({ subjectId }));
  }

  /**
   * Fase 4 — Decisión en shadow mode: congela un snapshot del estado, aplica
   * la política determinista y persiste el DecisionRecord con sus razones.
   * Nada cambia para el estudiante hasta que un humano apruebe.
   */
  async decide(subjectId: string) {
    const estimates = await this.repository.estimatesFor(subjectId);
    const constructs = Object.fromEntries(
      estimates.map((e) => [
        e.construct_id,
        { value: e.value, confidence: e.confidence, status: e.status },
      ]),
    );

    // Fase 3 — snapshot reproducible: estado + rango de eventos que lo produjo.
    const timeline = await this.repository.timeline(subjectId, 1000);
    const snapshot = await this.repository.saveSnapshot({
      subjectId,
      state: { constructs },
      sourceEventFrom: timeline.at(-1)?.event_id ?? 'none',
      sourceEventTo: timeline[0]?.event_id ?? 'none',
      modelVersion: DALA_MODEL_VERSION,
    });

    const policy = decideNextAction({ subjectId, constructs });
    const record = await this.repository.saveDecision({
      subjectId,
      objective: policy.objective,
      candidateActions: policy.candidateActions,
      selectedAction: policy.selectedAction,
      reasons: policy.reasons,
      stateSnapshotId: snapshot.snapshot_id,
      policyVersion: DALA_POLICY_VERSION,
      modelVersion: DALA_MODEL_VERSION,
      confidence: policy.confidence,
      expectedOutcome: policy.expectedOutcome,
    });
    return record;
  }

  /** Veredicto docente sobre una recomendación (aprueba/rechaza/edita). */
  async review(decisionId: string, verdict: 'approved' | 'rejected' | 'edited', reason?: string) {
    const decision = await this.repository.getDecision(decisionId);
    if (!decision) throw new BadRequestException('unknown_decision');
    return this.repository.reviewDecision(decisionId, verdict, reason);
  }

  /** Fase 5 — cierre del ciclo: efecto observado vs. esperado. */
  async recordOutcome(input: {
    decisionId: string;
    interventionId: string;
    metrics: Record<string, unknown>;
    observedAt?: string;
  }) {
    const decision = await this.repository.getDecision(input.decisionId);
    if (!decision) throw new BadRequestException('unknown_decision');
    const outcome = await this.repository.saveOutcome({
      decisionId: input.decisionId,
      interventionId: input.interventionId,
      subjectId: decision.subject_id,
      metrics: input.metrics,
      observedAt: input.observedAt ?? new Date().toISOString(),
    });
    const expected = decision.expected_outcome as { metric?: string } | null;
    return {
      outcomeId: outcome.outcome_id,
      expected,
      observed: input.metrics,
      metricMatched: expected?.metric ? input.metrics[expected.metric] !== undefined : null,
    };
  }

  /**
   * Traza completa (spec v3 Anexo B): decisión → snapshot → evidencia →
   * eventos → outcomes. Responde "¿por qué se decidió esto y qué pasó después?".
   */
  async getTrace(decisionId: string) {
    const decision = await this.repository.getDecision(decisionId);
    if (!decision) throw new BadRequestException('unknown_decision');
    const snapshot = await this.repository.getSnapshot(decision.state_snapshot_id);
    const observations = await this.repository.observationsBySubject(decision.subject_id);
    const outcomes = await this.repository.outcomesFor(decisionId);
    return {
      decision,
      stateSnapshot: snapshot,
      evidence: observations.map((o) => ({
        observationId: o.observation_id,
        constructId: o.construct_id,
        rule: `${o.rule_id}@${o.rule_version}`,
        weight: o.weight,
        sourceEventId: o.source_event_id,
        observedAt: o.observed_at,
      })),
      outcomes,
    };
  }

  // ── internos ────────────────────────────────────────────────────────────

  private async processEvidence(event: DalaBehaviorEvent) {
    const sessionEvents = await this.repository.sessionEvents(event.sessionId);
    const drafts = deriveEvidence(event, { sessionEvents });
    if (drafts.length === 0) return;

    await this.repository.saveObservations(drafts);

    const touched = [...new Set(drafts.map((d) => d.constructId))];
    for (const constructId of touched) {
      const definition = CONSTRUCT_REGISTRY[constructId];
      if (!definition) continue;
      const rows = await this.repository.observationsFor(event.subjectId, constructId);
      const diversity = await this.repository.evidenceDiversity(event.subjectId, constructId);
      const estimate = estimateConstruct({
        subjectId: event.subjectId,
        definition,
        observations: rows.map((r) => ({
          observationId: r.observation_id,
          subjectId: r.subject_id,
          sessionId: r.session_id,
          sourceEventId: r.source_event_id,
          ruleId: r.rule_id,
          ruleVersion: r.rule_version,
          constructId: r.construct_id as never,
          kind: r.kind as never,
          weight: r.weight,
          confidenceContribution: r.confidence_contribution,
          observedAt: r.observed_at.toISOString(),
          createdAt: r.created_at.toISOString(),
        })),
        distinctTasks: diversity.distinctTasks,
        distinctSessions: diversity.distinctSessions,
      });
      await this.repository.upsertEstimate({
        subjectId: estimate.subjectId,
        constructId: estimate.constructId,
        value: estimate.value,
        confidence: estimate.confidence,
        stability: estimate.stability,
        status: estimate.status,
        uncertainty: estimate.uncertainty,
        evidenceCount: estimate.evidenceCount,
        evidenceRefs: estimate.evidenceRefs,
        validUntil: estimate.validUntil,
        modelVersion: estimate.modelVersion,
      });
    }
  }

  private validate(event: DalaBehaviorEvent): string | null {
    if (!event || typeof event !== 'object') return 'invalid_envelope';
    if (event.schemaVersion !== DALA_EVENT_SCHEMA_VERSION) return 'unsupported_schema_version';
    if (!event.eventId || typeof event.eventId !== 'string') return 'missing_event_id';
    if (!event.subjectId) return 'missing_subject_id';
    if (!event.sessionId) return 'missing_session_id';
    if (!Number.isInteger(event.sequence) || event.sequence < 0) return 'invalid_sequence';
    if (!DALA_EVENT_TYPES.includes(event.eventType)) return 'unknown_event_type';
    if (!event.source?.instrumentId || !event.source?.instrumentVersion)
      return 'missing_instrument_version';
    if (Number.isNaN(Date.parse(event.occurredAt))) return 'invalid_occurred_at';
    return null;
  }
}

export class DalaValidationError extends BadRequestException {}
