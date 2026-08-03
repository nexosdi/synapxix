/**
 * D.A.L.A.™ — Decisiones, especificaciones de intervención y outcomes.
 *
 * El motor de decisión selecciona una acción estructurada con política
 * determinista y versionada. Si interviene un LLM, solo redacta dentro de la
 * decisión ya tomada: nunca define objetivos, ayuda ni estados (spec v3 §7).
 * En el MVP todo corre en shadow mode: la recomendación se registra y un
 * humano la acepta, rechaza o corrige; nada cambia automáticamente.
 */

/** Acciones comunicativas permitidas (spec v3 §7.2). Lista cerrada. */
export const DALA_ACTIONS = [
  'ASK',
  'CLARIFY',
  'EXPLAIN',
  'EXAMPLE',
  'HINT',
  'CHALLENGE',
  'COMPARE',
  'VERIFY',
  'SUMMARIZE',
  'REFLECT',
  'WITHDRAW_SUPPORT',
  'DEFER',
  'ESCALATE',
] as const;

export type DalaAction = (typeof DALA_ACTIONS)[number];

export interface DecisionRecord {
  decisionId: string;
  subjectId: string;
  timestamp: string;

  objective: string;
  candidateActions: DalaAction[];
  selectedAction: DalaAction;
  selectedInterventionId?: string;

  /** Razones estructuradas y reconstruibles, nunca prosa suelta. */
  reasons: Array<{ type: string; referenceId: string; explanation: string }>;

  /** Snapshot del estado usado para decidir: congela el "por qué". */
  stateSnapshotId: string;
  policyVersion: string;
  modelVersion: string;

  confidence: number;
  requiresHumanApproval: boolean;

  /** Resultado esperado, declarado ANTES de intervenir (spec v3 §3.2). */
  expectedOutcome?: { metric: string; probability: number };
}

/** Revisión humana de una decisión (shadow mode, directrices §14). */
export interface DecisionReview {
  decisionId: string;
  reviewerRole: 'teacher' | 'researcher' | 'director';
  verdict: 'approved' | 'rejected' | 'edited';
  reason?: string;
  reviewedAt: string;
}

/**
 * Especificación de contenido: D.A.L.A. nunca devuelve directamente una
 * actividad generada. Primero emite el contrato; la generación viene después,
 * con validadores y aprobación docente (directrices §11).
 */
export interface ContentSpec {
  targetSkillIds: string[];
  purpose: 'screening' | 'practice' | 'reteach' | 'extension';
  difficulty: number;
  estimatedDurationMinutes: number;

  supports: string[];
  interactionMode: string;
  thematicContext?: string;

  constraints: {
    ageRange: [number, number];
    locale: string;
    maxInstructionsLength?: number;
    allowedGameTypes: string[];
  };

  successCriteria: { targetAccuracy?: number; maxAttempts?: number };
}

/** Cierre del ciclo: qué ocurrió tras aplicar la intervención. */
export interface DalaOutcome {
  outcomeId: string;
  decisionId: string;
  interventionId: string;
  subjectId: string;

  metrics: {
    accuracy?: number;
    attempts?: number;
    latencyMs?: number;
    hintCount?: number;
    completed?: boolean;
    transferSuccess?: boolean;
  };

  observedAt: string;
}
