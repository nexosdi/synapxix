/**
 * D.A.L.A.™ — Constructos y estimaciones.
 *
 * Un constructo es una variable pedagógica con definición operacional.
 * Una estimación nunca es una etiqueta: lleva incertidumbre, contexto,
 * vigencia, evidencia referenciada y explicaciones alternativas (spec v3 §5).
 */

/**
 * Núcleo v0.1 (directrices §7). La ontología completa v3 NO se implementa
 * en el primer ciclo: cinco constructos bien medidos valen más que nueve
 * módulos sin calibrar.
 */
export const DALA_CORE_CONSTRUCTS = [
  'curricular_mastery',
  'persistence',
  'help_seeking',
  'strategy_flexibility',
  'task_engagement',
] as const;

export type DalaConstructId = (typeof DALA_CORE_CONSTRUCTS)[number];

/** Estados de validez de una estimación (spec v3 §5.2). */
export type DalaEstimateStatus =
  | 'insufficient_evidence'
  | 'provisional'
  | 'supported'
  | 'stable_in_context'
  | 'contradicted'
  | 'expired'
  | 'human_review_required';

export interface DalaUncertainty {
  lower: number;
  upper: number;
  /** Método con el que se calculó el intervalo, p. ej. 'beta_posterior'. */
  method: string;
}

/**
 * Estimación de un constructo para un sujeto.
 *
 * Reglas duras:
 *  - una interacción aislada no puede producir confianza alta;
 *  - `evidenceRefs` no puede estar vacío si status !== 'insufficient_evidence';
 *  - `modelVersion` es obligatoria: sin versión no hay reproducibilidad.
 */
export interface ConstructEstimate {
  constructId: DalaConstructId;
  subjectId: string;

  /** Valor 0..1 dentro del rango operacional del constructo. */
  value: number;
  /** 0..1 — función de cantidad, diversidad y recencia de evidencia. */
  confidence: number;
  /** 0..1 — consistencia entre ventanas temporales. */
  stability: number;
  status: DalaEstimateStatus;
  uncertainty: DalaUncertainty;

  /** Alcance contextual: la estimación vale aquí, no en general. */
  contextScope: { domain?: string; activityType?: string };

  evidenceCount: number;
  /** IDs de las observaciones de evidencia que la sustentan. */
  evidenceRefs: string[];
  /** Explicaciones rivales aún no descartadas. */
  alternativeExplanations: string[];

  calculatedAt: string;
  validUntil?: string;
  modelVersion: string;
}

/**
 * Definición operacional de un constructo: qué eventos aportan evidencia,
 * cuáles NO deben interpretarse, y bajo qué condiciones se invalida.
 * Es la ficha normativa que exige la directriz §7.
 */
export interface DalaConstructDefinition {
  constructId: DalaConstructId;
  name: string;
  operationalDefinition: string;
  /** Tipos de evento que PUEDEN aportar evidencia. */
  evidenceEventTypes: string[];
  /** Tipos de evento que NO deben interpretarse para este constructo. */
  excludedEventTypes: string[];
  /** Mínimos para salir de insufficient_evidence. */
  minimumEvidence: { observations: number; distinctTasks: number; distinctSessions: number };
  /** Vida media en días; pasado ese plazo la confianza decae. */
  halfLifeDays: number;
  invalidationConditions: string[];
}
