/**
 * D.A.L.A.™ — HumanState y snapshots.
 *
 * El HumanState es el estado dinámico del sujeto: estructurado, probabilístico
 * y reconstruible. No es una tabla plana ni un texto generado (directrices §9).
 * Los arquetipos son una vista narrativa posterior; jamás la verdad principal.
 */
import type { ConstructEstimate, DalaConstructId } from './construct';

export interface HumanState {
  subjectId: string;
  /** Versión incremental del estado del sujeto. */
  version: number;
  updatedAt: string;
  /** Versión del modelo/reglas con que se calculó. */
  modelVersion: string;

  constructs: Partial<Record<DalaConstructId, ConstructEstimate>>;

  /** Estado curricular por habilidad (referencia por ID al catálogo learning). */
  curricularState: Record<
    string,
    { masteryProbability: number; confidence: number; evidenceCount: number }
  >;

  /** Apoyos con eficacia estimada (no preferencias declaradas). */
  effectiveSupports: Array<{
    supportId: string;
    estimatedEffect: number;
    confidence: number;
  }>;

  /** Hipótesis activas aún no resueltas, con su evidencia. */
  activeHypotheses: Array<{
    hypothesisId: string;
    confidence: number;
    evidenceRefs: string[];
  }>;
}

/**
 * Fotografía inmutable del estado en un momento, con el rango de eventos que
 * la produjo. Se conservan snapshots (no solo el estado actual) para poder
 * reconstruir la trayectoria longitudinal y auditar cualquier decisión.
 */
export interface HumanStateSnapshot {
  snapshotId: string;
  subjectId: string;
  createdAt: string;
  state: HumanState;
  /** Primer y último evento incorporados a este snapshot. */
  sourceEventFrom: string;
  sourceEventTo: string;
  modelVersion: string;
}
