import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { deriveEvidence } from './evidence-rules';

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

describe('nuevas pruebas para reglas de evidencia v0.1', () => {
  it('pedir ayuda DESPUÉS de intentar aporta al constructo help_seeking', () => {
    const attempt = ev({ eventType: 'answer_submitted', sequence: 1 });
    const hint = ev({ eventType: 'hint_requested', sequence: 2 });
    const out = deriveEvidence(hint, { sessionEvents: [attempt] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('help_seeking');
    expect(out[0].weight).toBe(1);
  });

  it('cambio de estrategia tras fallo (sin pista inmediata) evidencia flexibilidad', () => {
    const fail = ev({ payload: { correct: false }, sequence: 1 });
    const strategy = ev({ eventType: 'strategy_changed', sequence: 2 });
    const out = deriveEvidence(strategy, { sessionEvents: [fail] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('strategy_flexibility');
    expect(out[0].weight).toBe(1);
  });

  it('cambio de estrategia inducido por pista NO evidencia flexibilidad', () => {
    const fail = ev({ payload: { correct: false }, sequence: 1 });
    const hint = ev({ eventType: 'hint_requested', sequence: 2 });
    const strategy = ev({ eventType: 'strategy_changed', sequence: 3 });
    const out = deriveEvidence(strategy, { sessionEvents: [fail, hint] });
    expect(out).toHaveLength(0);
  });

  it('completar tarea aporta a engagement', () => {
    const complete = ev({ eventType: 'task_completed', sequence: 1 });
    const out = deriveEvidence(complete, { sessionEvents: [] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('task_engagement');
    expect(out[0].weight).toBe(1);
  });

  it('abandonar tarea resta engagement', () => {
    const abandoned = ev({ eventType: 'task_abandoned', sequence: 1 });
    const out = deriveEvidence(abandoned, { sessionEvents: [] });
    expect(out).toHaveLength(1);
    expect(out[0].constructId).toBe('task_engagement');
    expect(out[0].weight).toBe(-0.6);
  });
});
