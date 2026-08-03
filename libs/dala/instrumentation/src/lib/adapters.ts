/**
 * D.A.L.A.™ — Adaptadores de los 3 instrumentos de primera validación
 * (directrices §5): categorization, timeline-order, intruder.
 *
 * Traducen interacciones de juego al envelope canónico vía el emitter.
 * Deterministas: sin red, sin efectos. La conexión al componente Angular
 * llega en la fase de wiring, tras aprobar estos contratos.
 */
import type { DalaBehaviorEvent, DalaEventContext } from '@nexosdi.synapxix/dala/contracts';
import { DalaEmitter } from './emitter';

/** Interacciones observables comunes a los tres juegos de primera validación. */
export type GameInteraction =
  | { kind: 'task_shown'; taskId: string; skillIds?: string[]; difficulty?: number }
  | { kind: 'instructions_opened'; taskId: string }
  | { kind: 'item_action'; taskId: string; detail: Record<string, unknown> }
  | { kind: 'answer'; taskId: string; correct: boolean; latencyMs?: number; attempt?: number }
  | { kind: 'retry'; taskId: string; attempt: number }
  | { kind: 'hint'; taskId: string; level?: number }
  | { kind: 'strategy_shift'; taskId: string; from?: string; to?: string }
  | { kind: 'abandon'; taskId: string }
  | { kind: 'complete'; taskId: string };

export class GameInstrumentAdapter {
  constructor(
    public readonly instrumentId: 'categorization' | 'timeline-order' | 'intruder',
    public readonly instrumentVersion: string,
    private readonly emitter: DalaEmitter,
  ) {}

  /** Mapea una interacción a su evento canónico y lo encola. */
  mapInteraction(interaction: GameInteraction, extra: Partial<DalaEventContext> = {}): DalaBehaviorEvent {
    const source = {
      instrumentId: this.instrumentId,
      instrumentVersion: this.instrumentVersion,
      gameType: this.instrumentId,
    };
    const ctx = (taskId: string, more: Partial<DalaEventContext> = {}): DalaEventContext => ({
      taskId,
      ...extra,
      ...more,
    });

    switch (interaction.kind) {
      case 'task_shown':
        return this.emitter.emit('task_presented', source, ctx(interaction.taskId, {
          skillIds: interaction.skillIds,
          difficulty: interaction.difficulty,
        }));
      case 'instructions_opened':
        return this.emitter.emit('instruction_opened', source, ctx(interaction.taskId));
      case 'item_action':
        return this.emitter.emit('action_performed', source, ctx(interaction.taskId), interaction.detail);
      case 'answer':
        return this.emitter.emit('answer_submitted', source, ctx(interaction.taskId), {
          correct: interaction.correct,
          latencyMs: interaction.latencyMs,
          attempt: interaction.attempt ?? 1,
        });
      case 'retry':
        return this.emitter.emit('attempt_repeated', source, ctx(interaction.taskId), {
          attempt: interaction.attempt,
        });
      case 'hint':
        return this.emitter.emit('hint_requested', source, ctx(interaction.taskId), {
          level: interaction.level ?? 1,
        });
      case 'strategy_shift':
        return this.emitter.emit('strategy_changed', source, ctx(interaction.taskId), {
          from: interaction.from,
          to: interaction.to,
        });
      case 'abandon':
        return this.emitter.emit('task_abandoned', source, ctx(interaction.taskId));
      case 'complete':
        return this.emitter.emit('task_completed', source, ctx(interaction.taskId));
    }
  }
}
