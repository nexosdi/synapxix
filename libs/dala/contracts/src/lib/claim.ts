/**
 * D.A.L.A.™ — Contrato de afirmación e instantánea (Anexo 24 del Fundacional).
 *
 * Una afirmación describe lo observado con numerador y denominador, declara
 * su método, sus alternativas y su próximo contraste, y enlaza la afirmación
 * anterior. La probabilidad calibrada queda vacía hasta que exista un método
 * calibrado y autorizado: un número sin calibrar se presentaría como certeza.
 */

/** Fuerza de la evidencia (eje 1). Requisitos fijados por la ficha. */
export type DalaEvidenceStatus =
  | 'sin_oportunidad_suficiente'
  | 'hipotesis_provisional'
  | 'respaldada_en_contexto';

/** Estado de revisión (eje 2), separado de la fuerza de la evidencia. */
export type DalaReviewStatus = 'pendiente' | 'confirmada' | 'cuestionada';

/** Los 7 ámbitos de referencia del §4. No son dimensiones psicológicas. */
export type DalaAmbitoId =
  | 'conocimientos'
  | 'pensamiento'
  | 'autorregulacion'
  | 'interaccion'
  | 'intereses'
  | 'digital_ia'
  | 'contexto';

export interface DalaClaim {
  /** Estable entre instantáneas: constructo + alcance. */
  key: string;
  /** Único: `key` + instantánea. Lo asigna la persistencia. */
  claimId?: string;
  subjectId: string;
  constructRef: string;
  ambito: DalaAmbitoId;
  frameworkVersion: string;
  scope: { scenes: string[]; skill?: string };
  /** Lo observado, siempre con su denominador. */
  observation: {
    numerator: number;
    denominator: number;
    excluded: number;
    detail: Record<string, number | string>;
  };
  /** Frase descriptiva: dominio, evidencia y alcance; nunca una etiqueta. */
  claim: string;
  evidenceStatus: DalaEvidenceStatus;
  reviewStatus: DalaReviewStatus;
  /** Siempre null en el piloto (Anexo 24). */
  calibratedProbability: null;
  /** Fuentes de las que proviene: observado, declarado o ambas. */
  origins: Array<'observed' | 'reported'>;
  evidenceRefs: string[];
  methodRef: string;
  alternatives: string[];
  nextCheck: string;
  previousClaimRef: string | null;
  /** Qué cambió respecto de la afirmación anterior, si la hay. */
  change: string | null;
}

export interface DalaAmbitoCoverage {
  ambito: DalaAmbitoId;
  observed: boolean;
  /** Por qué no hay evidencia y qué la produciría. */
  note: string;
}

export interface DalaSnapshotV2 {
  snapshotId?: string;
  subjectId: string;
  frameworkVersion: string;
  engineVersion: string;
  /** Primer y último evento incorporados, en orden de sesión y secuencia. */
  eventRange: { from: string | null; to: string | null; count: number };
  claims: DalaClaim[];
  coverage: DalaAmbitoCoverage[];
  context: Record<string, string | number>;
  createdAt: string;
}
