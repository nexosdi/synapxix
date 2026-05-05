import { signal, computed } from '@angular/core';

export type GameState =
  | 'IDLE'
  | 'LOADING'
  | 'READY'
  | 'PLAYING'
  | 'ANSWERING'
  | 'FEEDBACK'
  | 'ADVANCING'
  | 'COMPLETED';

/**
 * Metadata emitted with every state transition.
 * Useful for logging, telemetry, and hook orchestration.
 */
export interface StateTransitionEvent {
  from: GameState;
  to: GameState;
  timeInPreviousStateMs: number;
  context?: unknown;
}

/**
 * Hooks that can be registered for each state.
 * `onEnter` fires after transitioning into the state.
 * `onExit` fires before leaving the state.
 */
export interface StateHooks {
  onEnter?: (event: StateTransitionEvent) => void;
  onExit?: (event: StateTransitionEvent) => void;
}

/**
 * Callback type for global transition listeners.
 */
export type TransitionListener = (event: StateTransitionEvent) => void;

export class GameStateMachine {
  private _currentState = signal<GameState>('IDLE');

  public readonly currentState = this._currentState.asReadonly();

  // Helper computeds for easy template or conditional binding
  public readonly isIdle = computed(() => this._currentState() === 'IDLE');
  public readonly isLoading = computed(() => this._currentState() === 'LOADING');
  public readonly isReady = computed(() => this._currentState() === 'READY');
  public readonly isPlaying = computed(() => this._currentState() === 'PLAYING');
  public readonly isAnswering = computed(() => this._currentState() === 'ANSWERING');
  public readonly isFeedback = computed(() => this._currentState() === 'FEEDBACK');
  public readonly isAdvancing = computed(() => this._currentState() === 'ADVANCING');
  public readonly isCompleted = computed(() => this._currentState() === 'COMPLETED');

  // Valid state transitions
  private readonly transitions: Record<GameState, GameState[]> = {
    IDLE: ['LOADING'],
    LOADING: ['READY', 'COMPLETED'], // COMPLETED in case there's no content to load
    READY: ['PLAYING'],
    PLAYING: ['ANSWERING', 'ADVANCING'], // ADVANCING could happen if we skip
    ANSWERING: ['FEEDBACK'],
    FEEDBACK: ['ADVANCING', 'COMPLETED'],
    ADVANCING: ['READY', 'LOADING', 'COMPLETED'],
    COMPLETED: ['IDLE', 'LOADING'], // Allow to restart
  };

  // Per-state hooks
  private readonly _hooks = new Map<GameState, StateHooks>();

  // Global listeners notified on every transition
  private readonly _listeners: TransitionListener[] = [];

  // Track time between transitions
  private lastTransitionMs: number = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // ── Hook registration ────────────────────────────────────

  /**
   * Register onEnter/onExit hooks for a specific state.
   * Later registrations for the same state replace previous hooks.
   */
  public registerHooks(state: GameState, hooks: StateHooks): void {
    this._hooks.set(state, hooks);
  }

  /**
   * Add a global listener that fires on every successful transition.
   * Returns a cleanup function to remove the listener.
   */
  public onTransition(listener: TransitionListener): () => void {
    this._listeners.push(listener);
    return () => {
      const idx = this._listeners.indexOf(listener);
      if (idx !== -1) this._listeners.splice(idx, 1);
    };
  }

  // ── Transition ───────────────────────────────────────────

  /**
   * Intentional state transition with validation.
   * Executes onExit hook of the current state and onEnter hook of the new state.
   * Returns false if the transition is invalid.
   */
  public transitionTo(newState: GameState, context?: unknown): boolean {
    const current = this._currentState() as GameState;
    const allowedTransitions = this.transitions[current];

    if (!allowedTransitions.includes(newState)) {
      console.warn(`[GameStateMachine] Invalid transition attempt from ${current} to ${newState}`);
      return false;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const timeInState = now - this.lastTransitionMs;
    this.lastTransitionMs = now;

    const event: StateTransitionEvent = {
      from: current,
      to: newState,
      timeInPreviousStateMs: timeInState,
      context,
    };

    // Developer logging
    console.log(
      `%c[GameStateMachine]%c ${current} ➔ %c${newState}%c (spent ${timeInState.toFixed(0)}ms in ${current})`,
      'color: #94a3b8; font-weight: bold;',
      'color: inherit;',
      'color: #3b82f6; font-weight: bold;',
      'color: inherit;'
    );

    // 1. Execute onExit of the current state
    const exitHooks = this._hooks.get(current);
    if (exitHooks?.onExit) {
      exitHooks.onExit(event);
    }

    // 2. Change state
    this._currentState.set(newState);

    // 3. Execute onEnter of the new state
    const enterHooks = this._hooks.get(newState);
    if (enterHooks?.onEnter) {
      enterHooks.onEnter(event);
    }

    // 4. Notify global listeners
    for (const listener of this._listeners) {
      listener(event);
    }

    return true;
  }

  /**
   * Resets the state machine back to IDLE.
   * Does NOT execute hooks — this is a hard reset.
   */
  public reset(): void {
    this._currentState.set('IDLE');
    this.lastTransitionMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  /**
   * Remove all registered hooks and listeners.
   */
  public clearHooks(): void {
    this._hooks.clear();
    this._listeners.length = 0;
  }

  // Helper quick actions for explicit intention in code
  public startLoading(): void { this.transitionTo('LOADING'); }
  public setReady(): void { this.transitionTo('READY'); }
  public startPlaying(): void { this.transitionTo('PLAYING'); }
  public submitAnswer(): void { this.transitionTo('ANSWERING'); }
  public showFeedback(): void { this.transitionTo('FEEDBACK'); }
  public advance(): void { this.transitionTo('ADVANCING'); }
  public complete(): void { this.transitionTo('COMPLETED'); }
}
