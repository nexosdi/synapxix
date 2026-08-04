/**
 * D.A.L.A.™ Core v0.1 — Política de decisión determinista.
 *
 * Reglas pedagógicas explícitas, ordenadas por prioridad; nada de RL ni LLM
 * (spec v3 §7.3). El LLM, si algún día interviene, solo redacta DENTRO de la
 * acción ya elegida. Toda decisión sale con razones estructuradas, versión de
 * política y requiresHumanApproval=true: en el MVP todo es shadow mode.
 */
import type {
  ConstructEstimate,
  DalaAction,
  DalaConstructId,
} from '@nexosdi.synapxix/dala/contracts';

export const DALA_POLICY_VERSION = 'core-policy-0.1.0';

export interface PolicyInput {
  subjectId: string;
  constructs: Partial<Record<DalaConstructId, Pick<ConstructEstimate, 'value' | 'confidence' | 'status'>>>;
}

export interface PolicyDecision {
  objective: string;
  candidateActions: DalaAction[];
  selectedAction: DalaAction;
  reasons: Array<{ type: string; referenceId: string; explanation: string }>;
  confidence: number;
  expectedOutcome: { metric: string; probability: number };
}

const usable = (
  c: Pick<ConstructEstimate, 'value' | 'confidence' | 'status'> | undefined,
): c is Pick<ConstructEstimate, 'value' | 'confidence' | 'status'> =>
  Boolean(c && c.status !== 'insufficient_evidence' && c.status !== 'expired');

/**
 * Selección por reglas priorizadas. Principio rector: mínima ayuda necesaria
 * y esfuerzo productivo — la ayuda se gradúa y se retira, nunca resuelve.
 */
export function decideNextAction(input: PolicyInput): PolicyDecision {
  const { constructs } = input;
  const mastery = constructs.curricular_mastery;
  const persistence = constructs.persistence;
  const helpSeeking = constructs.help_seeking;
  const engagement = constructs.task_engagement;

  const reasons: PolicyDecision['reasons'] = [];
  const ref = (id: DalaConstructId) => `construct:${id}`;

  // R1 — Riesgo de abandono: bajar fricción antes que enseñar.
  if (usable(engagement) && engagement.value < 0.35) {
    reasons.push({
      type: 'engagement_low',
      referenceId: ref('task_engagement'),
      explanation: `engagement ${engagement.value} < 0.35: priorizar re-enganche sobre instrucción`,
    });
    return {
      objective: 'restore_task_engagement',
      candidateActions: ['ASK', 'EXAMPLE', 'DEFER'],
      selectedAction: 'ASK',
      reasons,
      confidence: engagement.confidence,
      expectedOutcome: { metric: 'task_completed', probability: 0.5 },
    };
  }

  // R2 — Insiste sin pedir ayuda y el dominio no mejora: ofrecer pista graduada.
  if (
    usable(mastery) && mastery.value < 0.45 &&
    usable(persistence) && persistence.value > 0.6 &&
    (!usable(helpSeeking) || helpSeeking.value < 0.4)
  ) {
    reasons.push(
      {
        type: 'mastery_low_persistence_high',
        referenceId: ref('curricular_mastery'),
        explanation: `mastery ${mastery.value} con persistencia ${persistence.value}: esfuerzo sin progreso`,
      },
      {
        type: 'help_underused',
        referenceId: ref('help_seeking'),
        explanation: 'no solicita apoyo pese al estancamiento: ofrecer pista nivel 1',
      },
    );
    return {
      objective: 'unblock_with_minimal_hint',
      candidateActions: ['HINT', 'CLARIFY', 'EXAMPLE'],
      selectedAction: 'HINT',
      reasons,
      confidence: Math.min(mastery.confidence, persistence.confidence),
      expectedOutcome: { metric: 'correct_after_hint', probability: 0.6 },
    };
  }

  // R3 — Dominio alto y estable: retirar apoyo y verificar transferencia.
  if (usable(mastery) && mastery.value > 0.75) {
    reasons.push({
      type: 'mastery_high',
      referenceId: ref('curricular_mastery'),
      explanation: `mastery ${mastery.value} > 0.75: reducir andamiaje y verificar sin apoyo`,
    });
    return {
      objective: 'verify_transfer_without_support',
      candidateActions: ['WITHDRAW_SUPPORT', 'CHALLENGE', 'VERIFY'],
      selectedAction: 'WITHDRAW_SUPPORT',
      reasons,
      confidence: mastery.confidence,
      expectedOutcome: { metric: 'independent_success', probability: 0.7 },
    };
  }

  // R4 — Dependencia de ayuda: pedir intento propio antes de la próxima pista.
  if (usable(helpSeeking) && helpSeeking.value > 0.8 && usable(mastery) && mastery.value < 0.6) {
    reasons.push({
      type: 'possible_help_dependence',
      referenceId: ref('help_seeking'),
      explanation: `uso de ayuda ${helpSeeking.value} con dominio ${mastery.value}: pedir intento autónomo`,
    });
    return {
      objective: 'promote_autonomous_attempt',
      candidateActions: ['REFLECT', 'VERIFY', 'DEFER'],
      selectedAction: 'REFLECT',
      reasons,
      confidence: helpSeeking.confidence,
      expectedOutcome: { metric: 'attempt_without_hint', probability: 0.55 },
    };
  }

  // R0 — Default: sin base suficiente para intervenir → observar y verificar.
  reasons.push({
    type: 'insufficient_signal',
    referenceId: 'policy:default',
    explanation: 'sin evidencia utilizable que justifique intervención: verificar comprensión',
  });
  return {
    objective: 'gather_evidence',
    candidateActions: ['VERIFY', 'ASK', 'DEFER'],
    selectedAction: 'VERIFY',
    reasons,
    confidence: 0.3,
    expectedOutcome: { metric: 'comprehension_verified', probability: 0.5 },
  };
}
