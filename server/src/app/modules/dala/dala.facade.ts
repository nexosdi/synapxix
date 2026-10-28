import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  DALA_EVENT_TYPES,
  DALA_EVENT_SCHEMA_VERSION,
  validateEventV2,
  type DalaBehaviorEvent,
  type DalaClaim,
  type DalaEventV2,
  type DalaIngestResult,
  type DalaSnapshotV2,
} from '@nexosdi.synapxix/dala/contracts';
import { PULSO_WEB_FRAMEWORK, type DalaFramework } from '@nexosdi.synapxix/dala/framework';
import {
  CONSTRUCT_REGISTRY,
  DALA_MODEL_VERSION,
  DALA_POLICY_VERSION,
  decideNextAction,
  deriveEvidence,
  estimateConstruct,
  PROJECTION_ENGINE_VERSION,
  canonicalJson,
  decideNext,
  orderEvents,
  projectSubject,
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

  /** Retiro de datos a pedido: borra todo lo de la persona en D.A.L.A. */
  forgetSubject(userId: string) {
    return this.repository.forgetSubject(userId);
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

  /** Historial de decisiones shadow de un sujeto (más recientes primero). */
  decisionsFor(subjectId: string, limit = 20) {
    return this.repository.decisionsBySubject(subjectId, limit);
  }

  /** Veredicto docente sobre una recomendación (aprueba/rechaza/edita). */
  async review(decisionId: string, verdict: 'approved' | 'rejected' | 'edited', reason?: string) {
    const decision = await this.repository.getDecision(decisionId);
    if (!decision) throw new BadRequestException('unknown_decision');
    return this.repository.reviewDecision(decisionId, verdict, reason);
  }

  /** Fase 5 — cierre del ciclo: efecto observado vs. esperado. */
  outcomesFor(decisionId: string) {
    return this.repository.outcomesFor(decisionId);
  }

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

  // ── Modelo Fundacional 0.1 ──────────────────────────────────────────────
  // El registro es la única verdad: el retrato se proyecta desde él con una
  // función pura y se congela en instantáneas encadenadas. Nada se deriva
  // incrementalmente al llegar un evento, así que el orden de llegada no
  // puede cambiar el resultado.

  readonly framework: DalaFramework = PULSO_WEB_FRAMEWORK;

  /** Ingesta v2: rechazo estructural o cuarentena semántica, siempre con motivo. */
  async ingestV2(event: DalaEventV2): Promise<DalaIngestResult> {
    const invalid = validateEventV2(event);
    if (invalid) return { eventId: event?.eventId ?? 'unknown', status: 'rejected', reason: invalid };
    if (event.context.frameworkVersion !== this.framework.version) {
      return { eventId: event.eventId, status: 'quarantined', reason: 'unknown_framework_version' };
    }
    const scene = this.framework.scenes.find((s) => s.id === event.scene.id);
    if (!scene || scene.version !== event.scene.version) {
      return { eventId: event.eventId, status: 'quarantined', reason: 'unknown_scene_version' };
    }
    if (!event.consent?.scopeId) {
      return { eventId: event.eventId, status: 'quarantined', reason: 'missing_consent_scope' };
    }
    const status = await this.repository.appendEventV2(event);
    if (status === 'sequence_conflict') {
      return { eventId: event.eventId, status: 'rejected', reason: 'sequence_conflict' };
    }
    return { eventId: event.eventId, status };
  }

  async ingestBatchV2(events: DalaEventV2[]): Promise<DalaIngestResult[]> {
    const results: DalaIngestResult[] = [];
    for (const event of events) results.push(await this.ingestV2(event));
    return results;
  }

  /**
   * Proyecta el retrato. Si el registro cambió desde la última instantánea,
   * congela una nueva: cada afirmación recibe su claimId y enlaza la anterior.
   */
  async snapshotV2(subjectId: string): Promise<DalaSnapshotV2 & { snapshotId: string; reused: boolean }> {
    const events = await this.repository.eventsV2ForSubject(subjectId);
    const [latestRow] = await this.repository.snapshotsV2(subjectId, PROJECTION_ENGINE_VERSION, 1);
    const latest = latestRow ? (latestRow.state_json as unknown as DalaSnapshotV2) : null;
    const probe = projectSubject(subjectId, events, this.framework, { previous: latest?.claims });
    const signature = (s: DalaSnapshotV2) =>
      `${s.eventRange.count}:${s.eventRange.to}:${s.claims.map((c) => c.reviewStatus).join(',')}`;
    if (latestRow && latest && signature(latest) === signature(probe)) {
      return { ...latest, snapshotId: latestRow.snapshot_id, reused: true };
    }
    const snapshotId = randomUUID();
    const snapshot: DalaSnapshotV2 & { snapshotId: string } = {
      ...probe,
      snapshotId,
      createdAt: new Date().toISOString(),
      claims: probe.claims.map((c) => ({ ...c, claimId: `${c.key}@${snapshotId}` })),
    };
    await this.repository.saveSnapshotV2(snapshotId, snapshot);
    return { ...snapshot, reused: false };
  }

  /** Una instantánea guardada del propio sujeto (p. ej. la "A" del recorrido). */
  async snapshotByIdV2(subjectId: string, snapshotId: string) {
    const rows = await this.repository.snapshotsV2(subjectId, PROJECTION_ENGINE_VERSION, 200);
    const row = rows.find((r) => r.snapshot_id === snapshotId);
    return row ? { ...(row.state_json as unknown as DalaSnapshotV2), snapshotId: row.snapshot_id } : null;
  }

  /**
   * Comprueba que la última instantánea se reproduce idéntica desde el
   * registro (puerta G1): mismos eventos y misma instantánea previa.
   */
  async replayCheckV2(subjectId: string) {
    const [latestRow, previousRow] = await this.repository.snapshotsV2(subjectId, PROJECTION_ENGINE_VERSION, 2);
    if (!latestRow) return { reproducible: null, reason: 'sin_instantaneas' };
    const latest = latestRow.state_json as unknown as DalaSnapshotV2;
    const previous = previousRow ? (previousRow.state_json as unknown as DalaSnapshotV2) : null;
    const ordered = orderEvents(await this.repository.eventsV2ForSubject(subjectId));
    const cut = ordered.findIndex((e) => e.eventId === latest.eventRange.to);
    const window = cut >= 0 ? ordered.slice(0, cut + 1) : [];
    const replay = projectSubject(subjectId, window, this.framework, { previous: previous?.claims });
    const strip = (claims: DalaClaim[]) => claims.map((c) => ({ ...c, claimId: undefined }));
    // Canónico: el estado guardado vuelve de JSONB con las claves reordenadas.
    const reproducible = canonicalJson(strip(replay.claims)) === canonicalJson(strip(latest.claims));
    return {
      reproducible,
      snapshotId: latestRow.snapshot_id,
      events: window.length,
      claims: latest.claims.length,
      engineVersion: PROJECTION_ENGINE_VERSION,
      frameworkVersion: this.framework.version,
    };
  }

  /** Decisión del catálogo sobre la instantánea vigente, en shadow mode. */
  async decideV2(subjectId: string) {
    const snapshot = await this.snapshotV2(subjectId);
    const proposal = decideNext(snapshot, this.framework);
    const selected = this.framework.decisions.find((d) => d.id === proposal.selected);
    const record = await this.repository.saveDecision({
      subjectId,
      objective: proposal.objective,
      candidateActions: [proposal.selected, ...proposal.alternatives.map((a) => a.id)],
      selectedAction: proposal.selected,
      reasons: proposal.reasons,
      stateSnapshotId: snapshot.snapshotId,
      policyVersion: this.framework.version,
      modelVersion: PROJECTION_ENGINE_VERSION,
      confidence: 0, // sin calibrar: nunca se muestra
      expectedOutcome: {
        ...proposal.expectedOutcome,
        verification: proposal.verification,
        content: proposal.content,
        alternatives: proposal.alternatives,
      },
    });
    return {
      decisionId: record.decision_id,
      selected: proposal.selected,
      label: selected?.label ?? proposal.selected,
      objective: proposal.objective,
      reasons: proposal.reasons,
      alternatives: proposal.alternatives,
      expectedOutcome: proposal.expectedOutcome,
      verification: proposal.verification,
      snapshotId: snapshot.snapshotId,
      policyVersion: this.framework.version,
    };
  }

  /**
   * Veredicto humano y contenido efectivamente asignado (§13): aprobar
   * asigna lo recomendado, editar asigna la alternativa elegida y rechazar
   * asigna la opción no personalizada de base.
   */
  async reviewV2(decisionId: string, verdict: 'approved' | 'edited' | 'rejected', chosen?: string, reason?: string) {
    const decision = await this.repository.getDecision(decisionId);
    if (!decision) throw new BadRequestException('unknown_decision');
    let assignedId = decision.selected_action;
    if (verdict === 'edited') {
      if (!chosen || !this.framework.decisions.some((d) => d.id === chosen)) {
        throw new BadRequestException('unknown_alternative');
      }
      assignedId = chosen;
    } else if (verdict === 'rejected') {
      assignedId = this.framework.baselineDecision;
    }
    const assigned = this.framework.decisions.find((d) => d.id === assignedId);
    const note = [reason, `asignado:${assignedId}`].filter(Boolean).join(' · ');
    await this.repository.reviewDecision(decisionId, verdict, note);
    return {
      decisionId,
      verdict,
      assigned: { id: assignedId, label: assigned?.label ?? assignedId, content: assigned?.content },
    };
  }

  /** De una afirmación a los eventos que la sostienen, en orden canónico. */
  async traceClaimV2(subjectId: string, claimKey: string) {
    const [latestRow] = await this.repository.snapshotsV2(subjectId, PROJECTION_ENGINE_VERSION, 1);
    if (!latestRow) throw new BadRequestException('no_snapshot');
    const snapshot = latestRow.state_json as unknown as DalaSnapshotV2;
    const claim = snapshot.claims.find((c) => c.key === claimKey);
    if (!claim) throw new BadRequestException('unknown_claim');
    const refs = new Set(claim.evidenceRefs);
    const ordered = orderEvents(await this.repository.eventsV2ForSubject(subjectId));
    const t0 = Date.parse(ordered.at(0)?.occurredAt ?? '');
    return {
      claim,
      snapshotId: latestRow.snapshot_id,
      events: ordered
        .filter((e) => refs.has(e.eventId))
        .map((e) => ({
          eventId: e.eventId,
          seconds: Number.isNaN(t0) ? 0 : Math.round((Date.parse(e.occurredAt) - t0) / 1000),
          scene: this.framework.scenes.find((s) => s.id === e.scene.id)?.title ?? e.scene.id,
          sceneRef: `${e.scene.id}@${e.scene.version}`,
          opportunity: e.opportunity ?? null,
          type: e.eventType,
          origin: e.origin,
          payload: e.payload,
        })),
    };
  }

  /** Exportación de investigación: registro, instantáneas, decisiones y resultados. */
  async exportV2(subjectId: string) {
    const events = orderEvents(await this.repository.eventsV2ForSubject(subjectId));
    const snapshots = await this.repository.snapshotsV2(subjectId, PROJECTION_ENGINE_VERSION, 200);
    const decisions = await this.repository.decisionsBySubject(subjectId, 200);
    const outcomes = await Promise.all(decisions.map((d) => this.repository.outcomesFor(d.decision_id)));
    return {
      schema: 'dala.research-export.v1',
      exportedAt: new Date().toISOString(),
      frameworkVersion: this.framework.version,
      engineVersion: PROJECTION_ENGINE_VERSION,
      subjectId,
      events,
      snapshots: snapshots.map((s) => ({ snapshotId: s.snapshot_id, ...(s.state_json as object) })),
      decisions,
      outcomes: outcomes.flat(),
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
