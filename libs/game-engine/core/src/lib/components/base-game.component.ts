import { OutputEmitterRef, EventEmitter, InputSignal } from '@angular/core';
import { InteractiveContent } from '../models/history.model';
import { AnyGameResult } from '../models/game-result.model';

/**
 * Contract that all minigame components must implement.
 *
 * Design decisions:
 * - `content` is the game-specific data
 * - `disabled` replaces direct state machine checks — when true, all interaction should be blocked
 * - `answerSubmitted` is the primary output for game results
 * - `firstInteraction` (optional) allows reaction-time tracking
 *
 * Games should NOT inject GameSessionService or GameFlowService.
 * They receive everything they need via inputs and emit results via outputs.
 *
 * Note: Properties use loose typing to accommodate both plain values and Angular signal inputs.
 * The generic TContent is not enforced on the interface to avoid InputSignal covariance issues.
 */
export interface BaseGameComponent {
  /** The game data, provided by the runner via setInput. */
  content: unknown;

  /**
   * Whether user interaction is disabled.
   * True when the game is not in PLAYING state (loading, answering, feedback, etc.).
   * Games should use this to disable buttons and prevent clicks.
   */
  disabled?: unknown;

  /** Emits when the user submits an answer. */
  answerSubmitted?: EventEmitter<AnyGameResult> | OutputEmitterRef<AnyGameResult>;

  /** (Optional) Emits on the user's first interaction for reaction-time tracking. */
  firstInteraction?: EventEmitter<void> | OutputEmitterRef<void>;

  /** (Optional) Emits when the game completes its internal flow. */
  gameCompleted?: EventEmitter<void> | OutputEmitterRef<void>;
}
