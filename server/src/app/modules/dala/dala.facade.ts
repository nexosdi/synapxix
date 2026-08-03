import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  DALA_EVENT_TYPES,
  DALA_EVENT_SCHEMA_VERSION,
  type DalaBehaviorEvent,
  type DalaIngestResult,
} from '@nexosdi.synapxix/dala/contracts';
import {
  CONSTRUCT_REGISTRY,
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
