/**
 * D.A.L.A.™ Core v0.1 — Reglas de evidencia.
 *
 * Deterministas, puras y versionadas: mismo evento + mismo contexto = misma
 * evidencia, siempre. Sin LLM, sin ML (directrices §8). Cada observación
 * emitida conserva regla, versión, peso y confianza aportada.
 *
 * Regla transversal: si context.rewardCondition es 'xp' o 'credits', los
 * constructos de persistencia y engagement no se actualizan — la recompensa
 * distorsiona la señal (directrices §2, economy).
 */
import type {
  DalaBehaviorEvent,
  EvidenceContext,
  EvidenceObservation,
  EvidenceRule,
} from '@nexosdi.synapxix/dala/contracts';

type Draft = Omit<EvidenceObservation, 'observationId' | 'createdAt'>;

const base = (
  event: DalaBehaviorEvent,
  ruleId: string,
  ruleVersion: string,
  constructId: Draft['constructId'],
  weight: number,
  confidenceContribution: number,
): Draft => ({
  subjectId: event.subjectId,
  sessionId: event.sessionId,
  sourceEventId: event.eventId,
  ruleId,
  ruleVersion,
  constructId,
  kind: 'observed',
  weight,
  confidenceContribution,
  observedAt: event.occurredAt,
});

const rewardActive = (e: DalaBehaviorEvent) =>
  e.context.rewardCondition === 'xp' || e.context.rewardCondition === 'credits';

/** Respuesta correcta sin pista previa en la tarea → evidencia de dominio. */
export const masteryFromAnswer: EvidenceRule = {
  id: 'mastery-from-answer',
  version: '0.1.0',
  accepts: (e) => e.eventType === 'answer_submitted',
  evaluate: (e, ctx) => {
    const correct = e.payload['correct'] === true;
    const usedHint = ctx.sessionEvents.some(
      (prev) =>
        prev.eventType === 'hint_requested' &&
        prev.context.taskId === e.context.taskId &&
        prev.sequence < e.sequence,
    );
    // Correcta con pista máxima no evidencia dominio (ficha del constructo).
    if (correct && usedHint) return [];
    return [
      base(e, 'mastery-from-answer', '0.1.0', 'curricular_mastery', correct ? 1 : -0.5, 0.15),
    ];
  },
};

/** Reintento tras fallo → persistencia; con ajuste de estrategia pesa más. */
export const persistenceFromRetry: EvidenceRule = {
  id: 'persistence-from-retry',
  version: '0.1.0',
  accepts: (e) => e.eventType === 'attempt_repeated',
  evaluate: (e, ctx) => {
    if (rewardActive(e)) return [];
    const priorFail = ctx.sessionEvents.some(
      (prev) =>
        prev.eventType === 'answer_submitted' &&
        prev.payload['correct'] === false &&
        prev.context.taskId === e.context.taskId,
    );
    if (!priorFail) return [];
    const attempt = typeof e.payload['attempt'] === 'number' ? (e.payload['attempt'] as number) : 1;
    // Insistencia sin ajuste más allá de 5 intentos deja de ser productiva.
    const weight = attempt > 5 ? -0.3 : 1;
    return [base(e, 'persistence-from-retry', '0.1.0', 'persistence', weight, 0.12)];
  },
};

/** Pedir pista después de intentar → búsqueda estratégica de ayuda. */
export const helpSeekingFromHint: EvidenceRule = {
  id: 'help-seeking-from-hint',
  version: '0.1.0',
  accepts: (e) => e.eventType === 'hint_requested' || e.eventType === 'clarification_requested',
  evaluate: (e, ctx) => {
    const triedFirst = ctx.sessionEvents.some(
      (prev) =>
        (prev.eventType === 'answer_submitted' || prev.eventType === 'action_performed') &&
        prev.context.taskId === e.context.taskId &&
        prev.sequence < e.sequence,
    );
    // Ayuda sin intento previo: se registra el evento pero no aporta al constructo.
    if (!triedFirst) return [];
    return [base(e, 'help-seeking-from-hint', '0.1.0', 'help_seeking', 1, 0.12)];
  },
};

/** Cambio de estrategia tras fallo, sin pista inmediata previa → flexibilidad. */
export const flexibilityFromStrategyChange: EvidenceRule = {
  id: 'flexibility-from-strategy-change',
  version: '0.1.0',
  accepts: (e) => e.eventType === 'strategy_changed',
  evaluate: (e, ctx) => {
    const inducedByHint = ctx.sessionEvents.some(
      (prev) =>
        prev.eventType === 'hint_requested' &&
        prev.context.taskId === e.context.taskId &&
        e.sequence - prev.sequence <= 2,
    );
    if (inducedByHint) return [];
    return [
      base(e, 'flexibility-from-strategy-change', '0.1.0', 'strategy_flexibility', 1, 0.12),
    ];
  },
};

/** Completar o abandonar tareas/sesiones → compromiso. */
export const engagementFromCompletion: EvidenceRule = {
  id: 'engagement-from-completion',
  version: '0.1.0',
  accepts: (e) =>
    e.eventType === 'task_completed' ||
    e.eventType === 'task_abandoned' ||
    e.eventType === 'session_completed' ||
    e.eventType === 'session_abandoned',
  evaluate: (e) => {
    if (rewardActive(e)) return [];
    const positive = e.eventType === 'task_completed' || e.eventType === 'session_completed';
    return [
      base(e, 'engagement-from-completion', '0.1.0', 'task_engagement', positive ? 1 : -0.6, 0.1),
    ];
  },
};

/** Conjunto v0.1. El orden no importa: las reglas son independientes. */
export const EVIDENCE_RULES_V01: EvidenceRule[] = [
  masteryFromAnswer,
  persistenceFromRetry,
  helpSeekingFromHint,
  flexibilityFromStrategyChange,
  engagementFromCompletion,
];

/** Aplica todas las reglas que aceptan el evento. Función pura. */
export function deriveEvidence(
  event: DalaBehaviorEvent,
  context: EvidenceContext,
  rules: EvidenceRule[] = EVIDENCE_RULES_V01,
): Draft[] {
  return rules.filter((r) => r.accepts(event)).flatMap((r) => r.evaluate(event, context));
}
