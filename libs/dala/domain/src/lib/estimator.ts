/**
 * D.A.L.A.™ Core v0.1 — Estimador Beta-Binomial.
 *
 * Método permitido para fase de factibilidad (spec v3 §15.2): interpretable,
 * barato y honesto con la incertidumbre. Nada de deep learning ni RL.
 *
 * Modelo: cada observación aporta peso ∈ [-1,1]. Se acumulan como
 * pseudo-conteos sobre una prior Beta(1,1) (uniforme): los positivos suman a
 * α, los negativos a β. El valor es la media posterior; el intervalo, la
 * aproximación normal del posterior; la confianza crece con cantidad y
 * diversidad de evidencia y decae con la vida media del constructo.
 */
import type {
  ConstructEstimate,
  DalaConstructDefinition,
  EvidenceObservation,
} from '@nexosdi.synapxix/dala/contracts';
import { DALA_MODEL_VERSION } from './construct-registry';

const DAY_MS = 86_400_000;

export interface EstimateInput {
  subjectId: string;
  definition: DalaConstructDefinition;
  observations: EvidenceObservation[];
  /** Tareas distintas de las que proviene la evidencia. */
  distinctTasks: number;
  distinctSessions: number;
  now?: Date;
}

export function estimateConstruct(input: EstimateInput): ConstructEstimate {
  const { definition, observations } = input;
  const now = input.now ?? new Date();

  // Decaimiento exponencial por recencia: la historia pondera, no borra (§5.4).
  const halfLifeMs = definition.halfLifeDays * DAY_MS;
  let alpha = 1;
  let beta = 1;
  for (const obs of observations) {
    const age = Math.max(0, now.getTime() - new Date(obs.observedAt).getTime());
    const decay = Math.pow(0.5, age / halfLifeMs);
    const w = Math.abs(obs.weight) * decay;
    if (obs.weight >= 0) alpha += w;
    else beta += w;
  }

  const value = alpha / (alpha + beta);
  const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
  const sd = Math.sqrt(variance);

  // Confianza: aportes individuales acotados + bono por diversidad de fuentes.
  const raw = observations.reduce((acc, o) => acc + o.confidenceContribution, 0);
  const diversityBonus = Math.min(input.distinctSessions - 1, 2) * 0.1;
  const confidence = Math.min(0.95, raw / (1 + raw * 0.5) + Math.max(0, diversityBonus));

  const meetsMinimum =
    observations.length >= definition.minimumEvidence.observations &&
    input.distinctTasks >= definition.minimumEvidence.distinctTasks &&
    input.distinctSessions >= definition.minimumEvidence.distinctSessions;

  // Estabilidad: acuerdo direccional simple entre mitades temporales.
  const stability = computeStability(observations);

  const status = !meetsMinimum
    ? 'insufficient_evidence'
    : stability < 0.35
      ? 'contradicted'
      : input.distinctSessions >= 2 && confidence >= 0.5
        ? 'supported'
        : 'provisional';

  return {
    constructId: definition.constructId,
    subjectId: input.subjectId,
    value: round(value),
    confidence: round(confidence),
    stability: round(stability),
    status,
    uncertainty: {
      lower: round(Math.max(0, value - 1.96 * sd)),
      upper: round(Math.min(1, value + 1.96 * sd)),
      method: 'beta_posterior',
    },
    contextScope: {},
    evidenceCount: observations.length,
    evidenceRefs: observations.map((o) => o.observationId),
    alternativeExplanations: [],
    calculatedAt: now.toISOString(),
    validUntil: new Date(now.getTime() + halfLifeMs).toISOString(),
    modelVersion: DALA_MODEL_VERSION,
  };
}

function computeStability(observations: EvidenceObservation[]): number {
  if (observations.length < 4) return 0.5; // neutral: sin base para juzgar
  const sorted = [...observations].sort(
    (a, b) => new Date(a.observedAt).getTime() - new Date(b.observedAt).getTime(),
  );
  const mid = Math.floor(sorted.length / 2);
  const mean = (xs: EvidenceObservation[]) =>
    xs.reduce((acc, o) => acc + o.weight, 0) / xs.length;
  const diff = Math.abs(mean(sorted.slice(0, mid)) - mean(sorted.slice(mid)));
  return round(Math.max(0, 1 - diff)); // 2 = máxima divergencia posible, acotamos suave
}

const round = (x: number) => Math.round(x * 1000) / 1000;
