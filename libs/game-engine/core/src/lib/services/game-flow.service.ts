import { Injectable, computed, OnDestroy } from '@angular/core';
import { GameStateMachine } from '../models/game-state-machine';
import { GameFlowConfig, DEFAULT_FLOW_CONFIG } from '../models/game-flow-config';

/**
 * Orchestrates the game state flow with properly managed timers.
 *
 * This service is the SINGLE OWNER of the GameStateMachine.
 * It replaces the scattered setTimeout calls that were in GameRunnerComponent
 * and provides a clean API for the runner to drive transitions.
 *
 * Key responsibilities:
 * - Owns and exposes the state machine (read-only for consumers)
 * - Manages all timed transitions with cancellable timers
 * - Provides a `disabled` signal that games can bind to
 * - Configurable timing via GameFlowConfig
 */
@Injectable({ providedIn: 'root' })
export class GameFlowService implements OnDestroy {
  // ── State machine (single owner) ───────────────────────
  private readonly _stateMachine = new GameStateMachine();

  /** Read-only access to the state machine for templates and computed signals. */
  public readonly stateMachine = this._stateMachine;

  /** Current state as a readable signal. */
  public readonly currentState = this._stateMachine.currentState;

  // ── Convenience computed signals ───────────────────────
  public readonly isIdle = this._stateMachine.isIdle;
  public readonly isLoading = this._stateMachine.isLoading;
  public readonly isReady = this._stateMachine.isReady;
  public readonly isPlaying = this._stateMachine.isPlaying;
  public readonly isAnswering = this._stateMachine.isAnswering;
  public readonly isFeedback = this._stateMachine.isFeedback;
  public readonly isAdvancing = this._stateMachine.isAdvancing;
  public readonly isCompleted = this._stateMachine.isCompleted;

  /**
   * Whether game interaction should be disabled.
   * True when the state is anything other than PLAYING.
   * Games should bind to this instead of checking state directly.
   */
  public readonly isInteractionDisabled = computed(() =>
    this._stateMachine.currentState() !== 'PLAYING'
  );

  // ── Timer management ───────────────────────────────────
  private _activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private _config: GameFlowConfig = { ...DEFAULT_FLOW_CONFIG };

  // ── Callbacks for the runner ───────────────────────────
  private _onAutoAdvance: (() => void) | null = null;

  constructor() {
    // Register hooks for automatic timed transitions
    this._stateMachine.registerHooks('READY', {
      onEnter: () => this.scheduleTimer('readyToPlay', () => {
        if (this._stateMachine.isReady()) {
          this._stateMachine.startPlaying();
        }
      }, this._config.readyToPlayDelayMs),
      onExit: () => this.cancelTimer('readyToPlay'),
    });

    this._stateMachine.registerHooks('ANSWERING', {
      onEnter: () => this.scheduleTimer('answerToFeedback', () => {
        if (this._stateMachine.isAnswering()) {
          this._stateMachine.showFeedback();
        }
      }, this._config.answerToFeedbackDelayMs),
      onExit: () => this.cancelTimer('answerToFeedback'),
    });

    this._stateMachine.registerHooks('FEEDBACK', {
      onEnter: () => {
        if (this._config.feedbackAutoAdvanceMs > 0) {
          this.scheduleTimer('feedbackAutoAdvance', () => {
            this.advanceNext();
          }, this._config.feedbackAutoAdvanceMs);
        }
      },
      onExit: () => this.cancelTimer('feedbackAutoAdvance'),
    });
  }

  ngOnDestroy(): void {
    this.cancelAllTimers();
    this._stateMachine.clearHooks();
  }

  // ── Configuration ──────────────────────────────────────

  /**
   * Override the default flow timing.
   * Call this before starting a session if you need custom timing.
   */
  public configure(config: Partial<GameFlowConfig>): void {
    this._config = { ...this._config, ...config };
  }

  /**
   * Register a callback that fires when auto-advance triggers.
   * The GameRunnerComponent sets this so the flow service can
   * drive the advance logic without knowing about HistoryService.
   */
  public onAutoAdvance(callback: () => void): void {
    this._onAutoAdvance = callback;
  }

  /**
   * Remove the auto-advance callback.
   * Call this on component destroy to prevent zombie callbacks.
   */
  public clearAutoAdvance(): void {
    this._onAutoAdvance = null;
  }

  // ── Flow control API (for GameRunnerComponent) ─────────

  /**
   * Start loading content. Transitions IDLE → LOADING.
   */
  public startLoading(): boolean {
    return this._stateMachine.transitionTo('LOADING');
  }

  /**
   * Content is ready. Transitions LOADING → READY.
   * The READY → PLAYING transition happens automatically via timer.
   */
  public contentReady(): boolean {
    return this._stateMachine.transitionTo('READY');
  }

  /**
   * User submitted an answer. Transitions PLAYING → ANSWERING.
   * The ANSWERING → FEEDBACK transition happens automatically via timer.
   */
  public answerSubmitted(): boolean {
    return this._stateMachine.transitionTo('ANSWERING');
  }

  /**
   * Manually advance to the next game.
   * Cancels any pending auto-advance timer.
   */
  public advanceNext(): void {
    this.cancelTimer('feedbackAutoAdvance');

    const state = this._stateMachine.currentState();
    if (state === 'COMPLETED' || state === 'ADVANCING') return;

    this._stateMachine.advance();

    if (this._onAutoAdvance) {
      this._onAutoAdvance();
    }
  }

  /**
   * Mark the journey as completed.
   */
  public completeJourney(): boolean {
    if (this._stateMachine.isCompleted()) {
      return true;
    }
    this.cancelAllTimers();
    return this._stateMachine.transitionTo('COMPLETED');
  }

  /**
   * Full reset for a new session.
   */
  public reset(): void {
    this.cancelAllTimers();
    this._stateMachine.reset();
    this._onAutoAdvance = null;
  }

  // ── Timer helpers ──────────────────────────────────────

  private scheduleTimer(name: string, callback: () => void, delayMs: number): void {
    this.cancelTimer(name);
    const id = setTimeout(callback, delayMs);
    this._activeTimers.set(name, id);
  }

  private cancelTimer(name: string): void {
    const id = this._activeTimers.get(name);
    if (id !== undefined) {
      clearTimeout(id);
      this._activeTimers.delete(name);
    }
  }

  private cancelAllTimers(): void {
    for (const id of this._activeTimers.values()) {
      clearTimeout(id);
    }
    this._activeTimers.clear();
  }
}
