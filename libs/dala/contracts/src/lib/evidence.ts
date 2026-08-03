/**
 * D.A.L.A.™ — Evidencia derivada de eventos.
 *
 * La evidencia es el eslabón trazable entre un hecho observado y una
 * estimación. Cada observación conserva qué evento la produjo, qué regla se
 * usó y en qué versión (directrices §8). El motor v0 es de reglas explícitas:
 * ni LLM ni ML calculan constructos.
 */
import type { DalaBehaviorEvent } from './event';
import type { DalaConstructId } from './construct';

export type DalaEvidenceKind =
  | 'observed'
  | 'reported'
  | 'assessed'
  | 'human_interpreted'
  | 'contextual';

export interface EvidenceObservation {
  observationId: string;
  subjectId: string;
  sessionId: string;

  /** Evento que la originó (trazabilidad hacia atrás). */
  sourceEventId: string;
  /** Regla que la derivó y su versión (trazabilidad del método). */
  ruleId: string;
  ruleVersion: string;

  constructId: DalaConstructId;
  kind: DalaEvidenceKind;

  /** Dirección y magnitud: -1..1 (negativa = evidencia en contra). */
  weight: number;
  /** Cuánta confianza aporta esta observación aislada: 0..1, típicamente baja. */
  confidenceContribution: number;

  observedAt: string;
  createdAt: string;
}

/** Contexto que una regla puede necesitar además del evento puntual. */
export interface EvidenceContext {
  /** Eventos previos de la misma sesión, en orden de secuencia. */
  sessionEvents: DalaBehaviorEvent[];
}

/**
 * Contrato de una regla de evidencia. Las reglas son deterministas, puras y
 * versionadas: la misma entrada produce siempre la misma salida.
 */
export interface EvidenceRule {
  id: string;
  version: string;
  accepts(event: DalaBehaviorEvent): boolean;
  evaluate(
    event: DalaBehaviorEvent,
    context: EvidenceContext,
  ): Omit<EvidenceObservation, 'observationId' | 'createdAt'>[];
}
