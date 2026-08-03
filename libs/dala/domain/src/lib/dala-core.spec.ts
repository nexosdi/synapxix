/**
 * Pruebas de conformidad D.A.L.A. Core v0.1.
 * Cubren los invariantes que exige el Definition of Done: determinismo,
 * trazabilidad de evidencia, exclusiones y umbrales mínimos.
 */
import type { DalaBehaviorEvent, EvidenceObservation } from '@nexosdi.synapxix/dala/contracts';
import { deriveEvidence } from './evidence-rules';
import { estimateConstruct } from './estimator';
import { CONSTRUCT_REGISTRY } from './construct-registry';

const ev = (partial: Partial<DalaBehaviorEvent>): DalaBehaviorEvent => ({
  schemaVersion: 'dala.behavior-event.v1',
  eventId: partial.eventId ?? `e-${Math.random()}`,
  subjectId: 's-1',
  sessionId: 'ses-1',
  occurredAt: '2026-08-03T10:00:00Z',
  sequence: 1,
  eventType: 'answer_submitted',
  source: { applicationId: 'test', instrumentId: 'categorization', instrumentVersion: '1.0.0' },
  context: { taskId: 't-1' },
  payload: {},
  consent: { scopeId: 'cp-1', researchAllowed: true },
  ...partial,
});

describe('reglas de evidencia v0.1', () => {
  it('una respuesta correcta sin pista evidencia dominio', () => {
    const e = ev({ payload: { correct: true } });
    const out = deriveEvidence(e, { sessionEvents: [] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('curricular_mastery');
    expect(out[0].weight).toBe(1);
    expect(out[0].sourceEventId).toBe(e.eventId);
    expect(out[0].ruleVersion).toBe('0.1.0');
  });

  it('una respuesta correcta CON pista previa no evidencia dominio', () => {
    const hint = ev({ eventType: 'hint_requested', sequence: 1 });
    const answer = ev({ payload: { correct: true }, sequence: 2 });
    const out = deriveEvidence(answer, { sessionEvents: [hint] });
    expect(out).toHaveLength(0);
  });

  it('el reintento tras fallo evidencia persistencia', () => {
    const fail = ev({ payload: { correct: false }, sequence: 1 });
    const retry = ev({ eventType: 'attempt_repeated', sequence: 2, payload: { attempt: 2 } });
    const out = deriveEvidence(retry, { sessionEvents: [fail] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('persistence');
    expect(out[0].weight).toBe(1);
  });

  it('con recompensa activa la persistencia NO se actualiza', () => {
    const fail = ev({ payload: { correct: false }, sequence: 1 });
    const retry = ev({
      eventType: 'attempt_repeated',
      sequence: 2,
      context: { taskId: 't-1', rewardCondition: 'xp' },
    });
    expect(deriveEvidence(retry, { sessionEvents: [fail] })).toHaveLength(0);
  });

  it('insistir más de 5 veces sin ajuste pesa en contra', () => {
    const fail = ev({ payload: { correct: false }, sequence: 1 });
    const retry = ev({ eventType: 'attempt_repeated', sequence: 7, payload: { attempt: 6 } });
    const out = deriveEvidence(retry, { sessionEvents: [fail] });
    expect(out[0].weight).toBeLessThan(0);
  });

  it('pedir ayuda sin intentar antes no aporta al constructo', () => {
    const hint = ev({ eventType: 'hint_requested', sequence: 1 });
    expect(deriveEvidence(hint, { sessionEvents: [] })).toHaveLength(0);
  });

  it('es determinista: mismo evento y contexto, misma evidencia', () => {
    const e = ev({ eventId: 'fixed', payload: { correct: true } });
    const a = deriveEvidence(e, { sessionEvents: [] });
    const b = deriveEvidence(e, { sessionEvents: [] });
    expect(a).toEqual(b);
  });
});

describe('estimador Beta-Binomial', () => {
  const obs = (n: number, weight = 1): EvidenceObservation[] =>
    Array.from({ length: n }, (_, i) => ({
      observationId: `o-${i}`,
      subjectId: 's-1',
      sessionId: `ses-${i % 2}`,
      sourceEventId: `e-${i}`,
      ruleId: 'r',
      ruleVersion: '0.1.0',
      constructId: 'persistence',
      kind: 'observed',
      weight,
      confidenceContribution: 0.12,
      observedAt: '2026-08-01T10:00:00Z',
      createdAt: '2026-08-01T10:00:00Z',
    }));

  it('con poca evidencia el estado es insufficient_evidence', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(2),
      distinctTasks: 1,
      distinctSessions: 1,
      now: new Date('2026-08-03'),
    });
    expect(est.status).toBe('insufficient_evidence');
  });

  it('una interacción aislada nunca produce confianza alta', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(1),
      distinctTasks: 1,
      distinctSessions: 1,
      now: new Date('2026-08-03'),
    });
    expect(est.confidence).toBeLessThan(0.3);
  });

  it('con evidencia suficiente y 2+ sesiones el estado puede ser supported', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(8),
      distinctTasks: 3,
      distinctSessions: 2,
      now: new Date('2026-08-03'),
    });
    expect(['provisional', 'supported']).toContain(est.status);
    expect(est.value).toBeGreaterThan(0.5);
    expect(est.evidenceRefs).toHaveLength(8);
    expect(est.modelVersion).toBe('dala-core-0.1.0');
    expect(est.uncertainty.method).toBe('beta_posterior');
  });

  it('la evidencia contradictoria baja la estabilidad, no desaparece', () => {
    const mixed = [...obs(4, 1), ...obs(4, -1).map((o, i) => ({
      ...o,
      observationId: `neg-${i}`,
      observedAt: '2026-08-02T10:00:00Z',
    }))];
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: mixed,
      distinctTasks: 3,
      distinctSessions: 2,
      now: new Date('2026-08-03'),
    });
    expect(est.stability).toBeLessThan(0.5);
    expect(est.evidenceCount).toBe(8);
  });
});
