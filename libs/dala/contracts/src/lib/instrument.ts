/**
 * D.A.L.A.™ — Contrato de instrumentación.
 *
 * Cada minijuego (u otra experiencia) implementa un adaptador que traduce sus
 * interacciones internas al envelope canónico. El juego no conoce D.A.L.A.
 * por dentro; solo emite eventos homogéneos (directrices §5).
 */
import type { DalaBehaviorEvent } from './event';

export interface InstrumentContext {
  subjectId: string;
  sessionId: string;
  /** Próximo número de secuencia de la sesión. */
  nextSequence(): number;
  consent: { scopeId: string; researchAllowed: boolean };
  locale?: string;
}

export interface DalaInstrumentAdapter {
  instrumentId: string;
  instrumentVersion: string;

  /**
   * Traduce una interacción del instrumento a cero o más eventos canónicos.
   * Debe ser pura respecto de la interacción: sin efectos, sin red.
   */
  mapInteraction(interaction: unknown, context: InstrumentContext): DalaBehaviorEvent[];
}
