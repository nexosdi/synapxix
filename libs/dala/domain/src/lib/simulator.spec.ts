/**
 * Simulador de estudiantes (DoD v0.1): cinco trayectorias distintas
 * atraviesan el ciclo completo eventos → evidencia → estimación → decisión,
 * y cada perfil debe producir una política diferente y explicable.
 */
import type { DalaBehaviorEvent, EvidenceObservation } from '@nexosdi.synapxix/dala/contracts';
import { deriveEvidence } from './evidence-rules';
import { estimateConstruct } from './estimator';
import { CONSTRUCT_REGISTRY } from './construct-registry';
import { decideNextAction, DALA_POLICY_VERSION } from './policy';

let seq = 0;
let ids = 0;
const ev = (
  sessionId: string,
  eventType: DalaBehaviorEvent['eventType'],
  taskId: string,
  payload: Record<string, unknown> = {},
): DalaBehaviorEvent => ({
  schemaVersion: 'dala.behavior-event.v1',
  eventId: `e-${++ids}`,
  subjectId: 'sim',
  sessionId,
  occurredAt: `2026-08-0${1 + (seq % 3)}T10:0${seq % 10}:00Z`,
  sequence: ++seq,
  eventType,
  source: { applicationId: 'sim', instrumentId: 'categorization', instrumentVersion: '1.0.0' },
  context: { taskId },
  payload,
  consent: { scopeId: 'cp-sim', researchAllowed: true },
});

/** Corre una trayectoria completa y devuelve la decisión de la política. */
function runTrajectory(events: DalaBehaviorEvent[]) {
  const session: DalaBehaviorEvent[] = [];
  const observations: EvidenceObservation[] = [];
  let n = 0;
  for (const event of events) {
    const drafts = deriveEvidence(event, { sessionEvents: session });
    session.push(event);
    observations.push(
      ...drafts.map((d) => ({ ...d, observationId: `o-${++n}`, createdAt: d.observedAt })),
    );
  }
  const constructs: Parameters<typeof decideNextAction>[0]['constructs'] = {};
  for (const constructId of Object.keys(CONSTRUCT_REGISTRY) as Array<keyof typeof CONSTRUCT_REGISTRY>) {
    const obs = observations.filter((o) => o.constructId === constructId);
    if (obs.length === 0) continue;
    const est = estimateConstruct({
      subjectId: 'sim',
      definition: CONSTRUCT_REGISTRY[constructId],
      observations: obs,
      distinctTasks: new Set(events.map((e) => e.context.taskId)).size,
      distinctSessions: new Set(events.map((e) => e.sessionId)).size,
      now: new Date('2026-08-04'),
    });
    constructs[est.constructId] = est;
  }
  return { decision: decideNextAction({ subjectId: 'sim', constructs }), constructs };
}

/** Genera N tareas con el mismo patrón por tarea, repartidas en 2 sesiones. */
const pattern = (
  make: (taskId: string, sessionId: string) => DalaBehaviorEvent[],
  tasks = 6,
): DalaBehaviorEvent[] =>
  Array.from({ length: tasks }, (_, i) =>
    make(`t${i}`, i < tasks / 2 ? 'ses-a' : 'ses-b'),
  ).flat();

describe('simulador — cinco trayectorias, cinco políticas', () => {
  beforeEach(() => {
    seq = 0;
    ids = 0;
  });

  it('T1 dominante: acierta siempre → retirar apoyo', () => {
    const { decision } = runTrajectory(
      pattern((t, s) => [
        ev(s, 'answer_submitted', t, { correct: true }),
        ev(s, 'task_completed', t),
      ]),
    );
    expect(decision.selectedAction).toBe('WITHDRAW_SUPPORT');
    expect(decision.objective).toBe('verify_transfer_without_support');
  });

  it('T2 estancado que no pide ayuda: falla e insiste → pista mínima', () => {
    const { decision } = runTrajectory(
      pattern((t, s) => [
        ev(s, 'answer_submitted', t, { correct: false }),
        ev(s, 'attempt_repeated', t, { attempt: 2 }),
        ev(s, 'answer_submitted', t, { correct: false, attempt: 2 }),
        ev(s, 'task_completed', t),
      ]),
    );
    expect(decision.selectedAction).toBe('HINT');
  });

  it('T3 desenganchado: abandona casi todo → re-enganche antes que instrucción', () => {
    const { decision } = runTrajectory(
      pattern((t, s) => [
        ev(s, 'answer_submitted', t, { correct: false }),
        ev(s, 'task_abandoned', t),
      ]),
    );
    expect(decision.selectedAction).toBe('ASK');
    expect(decision.objective).toBe('restore_task_engagement');
  });

  it('T4 dependiente de ayuda: pide pista tras cada intento y no domina → reflexión', () => {
    const { decision } = runTrajectory(
      pattern((t, s) => [
        ev(s, 'answer_submitted', t, { correct: false }),
        ev(s, 'hint_requested', t, { level: 1 }),
        ev(s, 'answer_submitted', t, { correct: true }), // correcto con pista: no cuenta como dominio
        ev(s, 'task_completed', t),
      ]),
    );
    expect(decision.selectedAction).toBe('REFLECT');
    expect(decision.objective).toBe('promote_autonomous_attempt');
  });

  it('T5 sin señal: una sola interacción → solo verificar, jamás intervenir', () => {
    const { decision, constructs } = runTrajectory([
      ev('ses-a', 'answer_submitted', 't0', { correct: true }),
    ]);
    expect(decision.selectedAction).toBe('VERIFY');
    expect(decision.objective).toBe('gather_evidence');
    for (const c of Object.values(constructs)) {
      expect(c?.status).toBe('insufficient_evidence');
    }
  });

  it('toda decisión declara razones, confianza y versión de política', () => {
    const { decision } = runTrajectory(
      pattern((t, s) => [ev(s, 'answer_submitted', t, { correct: true }), ev(s, 'task_completed', t)]),
    );
    expect(decision.reasons.length).toBeGreaterThan(0);
    expect(decision.reasons[0].referenceId).toContain(':');
    expect(decision.confidence).toBeGreaterThan(0);
    expect(DALA_POLICY_VERSION).toBe('core-policy-0.1.0');
  });
});
