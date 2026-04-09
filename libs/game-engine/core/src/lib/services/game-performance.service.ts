import { inject, Injectable } from '@angular/core';
import { PerformanceEvent } from '../models/performance-event.model';
import { GameSession } from '../models/game-session.model';
import { AnyGameResult } from '../models/game-result.model';
import {
  PerformanceEventDispatcher,
  PERFORMANCE_EVENT_DISPATCHER,
} from './performance-event-dispatcher';
import { ConsoleEventDispatcher } from './console-event-dispatcher';

/**
 * Internal bookkeeping for an in-progress game.
 * Created when `markPlayStart` is called, consumed by `recordPerformance`.
 */
interface ActiveTimingContext {
  contentId: string;
  /** High-resolution timestamp (ms) when the game entered PLAYING */
  playStartMs: number;
  /** High-resolution timestamp (ms) of the first user interaction, if reported */
  firstInteractionMs: number | null;
}

/**
 * Captures, buffers, and asynchronously dispatches performance events
 * for every minigame attempt.
 *
 * ## Design goals
 * 1. **Zero visual impact** — timestamps use `performance.now()` (~1µs),
 *    events are buffered in memory, and flushes happen inside
 *    `requestIdleCallback` so the main thread stays free for animations.
 * 2. **Automatic measurement** — `GameRunnerComponent` calls `markPlayStart`
 *    and `recordPerformance` so individual game components don't need to
 *    track time themselves.
 * 3. **Backend-agnostic** — the actual sending is delegated to a
 *    `PerformanceEventDispatcher` provided via DI.  In dev we log to
 *    console; in prod we'll POST to the API.
 */
@Injectable({ providedIn: 'root' })
export class GamePerformanceService {
  private readonly dispatcher: PerformanceEventDispatcher = inject(PERFORMANCE_EVENT_DISPATCHER, { optional: true }) ?? new ConsoleEventDispatcher();

  /** Currently active timing context per contentId */
  private activeTimings = new Map<string, ActiveTimingContext>();

  /** Buffered events waiting to be dispatched */
  private buffer: PerformanceEvent[] = [];

  /** Tracks how many attempts per contentId within the current session */
  private attemptCounts = new Map<string, number>();

  /** Size threshold that triggers an auto-flush */
  private readonly BUFFER_FLUSH_SIZE = 10;

  // ── Public API ──────────────────────────────────────────────

  /**
   * Call when the game enters PLAYING state.
   * Captures a high-resolution start timestamp.
   */
  markPlayStart(contentId: string): void {
    this.activeTimings.set(contentId, {
      contentId,
      playStartMs: performance.now(),
      firstInteractionMs: null,
    });
  }

  /**
   * Call when the user performs their first interaction with the game
   * (click, keypress, drag, etc.).
   *
   * This is **optional** — if never called, `reactionTimeMs` will
   * equal `completionTimeMs` which is a safe default.
   */
  markFirstInteraction(contentId: string): void {
    const ctx = this.activeTimings.get(contentId);
    if (ctx && ctx.firstInteractionMs === null) {
      ctx.firstInteractionMs = performance.now();
    }
  }

  /**
   * Finalises the performance measurement for a game and enqueues
   * the resulting `PerformanceEvent` in the buffer.
   *
   * Called automatically by `GameRunnerComponent.onAnswerSubmitted`.
   */
  recordPerformance(
    contentId: string,
    result: AnyGameResult,
    session: GameSession,
  ): void {
    const now = performance.now();
    const ctx = this.activeTimings.get(contentId);

    // Calculate timing
    const completionTimeMs = ctx ? now - ctx.playStartMs : result.timeSpentMs;
    const reactionTimeMs = ctx?.firstInteractionMs
      ? ctx.firstInteractionMs - ctx.playStartMs
      : completionTimeMs;

    // Track attempt count
    const prevAttempts = this.attemptCounts.get(contentId) ?? 0;
    const attemptNumber = prevAttempts + 1;
    this.attemptCounts.set(contentId, attemptNumber);

    // Derive normalised accuracy (0-1)
    const accuracy = this.deriveAccuracy(result);

    const event: PerformanceEvent = {
      eventId: this.generateId(),
      sessionId: session.id,
      contentId,
      gameType: result.gameType,
      userId: session.userId,

      reactionTimeMs,
      completionTimeMs,
      accuracy,
      score: result.score,
      isCorrect: result.isCorrect,

      attemptNumber,
      timestamp: new Date(),
      category: session.category,
    };

    this.buffer.push(event);

    // Clean up the timing context
    this.activeTimings.delete(contentId);

    // Auto-flush if buffer is large enough
    if (this.buffer.length >= this.BUFFER_FLUSH_SIZE) {
      this.scheduleFlush();
    }
  }

  /**
   * Forces a flush of all buffered events.
   * Call this when the session completes to ensure nothing is left behind.
   */
  flush(): void {
    this.scheduleFlush();
  }

  /**
   * Resets internal state for a new session.
   */
  resetSession(): void {
    this.activeTimings.clear();
    this.attemptCounts.clear();
    // Don't clear the buffer — existing events should still be dispatched
  }

  // ── Getters for testing ────────────────────────────────────

  /** @internal visible for testing */
  get pendingEventsCount(): number {
    return this.buffer.length;
  }

  /** @internal visible for testing */
  getActiveTimingFor(contentId: string): ActiveTimingContext | undefined {
    return this.activeTimings.get(contentId);
  }

  // ── Private helpers ────────────────────────────────────────

  /**
   * Schedules a flush on the browser's idle time so we never
   * compete with animations or input handling.
   */
  private scheduleFlush(): void {
    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.buffer = [];

    const doFlush = () => {
      this.dispatcher.dispatch(batch).catch(err => {
        console.error('[GamePerformanceService] Dispatch failed, re-enqueueing', err);
        // Put events back so they aren't lost
        this.buffer.unshift(...batch);
      });
    };

    // Use requestIdleCallback when available (most modern browsers),
    // fall back to setTimeout(0) which still yields to the event loop.
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => doFlush());
    } else {
      setTimeout(() => doFlush(), 0);
    }
  }

  /**
   * Derives a normalised accuracy value from the game result.
   *
   * Current heuristic:
   * - `isCorrect === true && score >= 100` → 1.0
   * - `isCorrect === true`                 → clamp(score / 100, 0.5, 1.0)
   * - `isCorrect === false`                → clamp(score / 100, 0, 0.49)
   *
   * Individual games can override this in the future by providing a
   * numeric `accuracy` field in their `feedback` object.
   */
  private deriveAccuracy(result: AnyGameResult): number {
    // Check if game explicitly provides accuracy
    const explicitAccuracy = (result as any).feedback?.accuracy;
    if (typeof explicitAccuracy === 'number') {
      return Math.max(0, Math.min(1, explicitAccuracy));
    }

    if (result.isCorrect) {
      return result.score >= 100
        ? 1.0
        : Math.max(0.5, Math.min(1.0, result.score / 100));
    }

    return Math.max(0, Math.min(0.49, result.score / 100));
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }
}
