import { GameType, SubjectCategory, DifficultyLevel } from './history.model';

/**
 * Standardized performance event emitted by the game engine.
 *
 * These events capture precision and reaction-time metrics for each
 * minigame attempt.  They are buffered in memory and flushed
 * asynchronously (via `requestIdleCallback`) so they never interfere
 * with animations or rendering.
 *
 * The shape is backend-agnostic — a `PerformanceEventDispatcher`
 * decides where events actually go (console, HTTP, IndexedDB, etc.).
 */
export interface PerformanceEvent {
  // ── Identity ──────────────────────────────────────────────
  /** Unique ID for this event (UUID v4) */
  eventId: string;
  /** Parent session ID from GameSessionService */
  sessionId: string;
  /** The InteractiveContent.id that was being played */
  contentId: string;
  /** e.g. 'read-select', 'intruder', … */
  gameType: GameType;
  /** User that played (placeholder until auth is wired) */
  userId: string;

  // ── Performance metrics ───────────────────────────────────
  /**
   * Milliseconds from the game entering PLAYING state until the
   * user's **first interaction** (click, key press, drag, etc.).
   *
   * If the game does not report `firstInteraction`, this equals
   * `completionTimeMs` as a safe default.
   */
  reactionTimeMs: number;

  /**
   * Milliseconds from the game entering PLAYING state until
   * `answerSubmitted` fires.  Measured with `performance.now()`.
   */
  completionTimeMs: number;

  /**
   * Normalised accuracy in the range `[0, 1]`.
   * Derived from `isCorrect` + `score` by the performance service.
   * Games can override this via the result's `feedback` field in the
   * future if they need a more nuanced accuracy value.
   */
  accuracy: number;

  /** Raw score exactly as the game reported it. */
  score: number;

  /** Whether the answer was considered correct by the game logic. */
  isCorrect: boolean;

  // ── Contextual metadata ───────────────────────────────────
  /**
   * How many times the user attempted this specific content within
   * the same session (1 = first try).
   */
  attemptNumber: number;

  /** ISO-precision timestamp of when the event was generated. */
  timestamp: Date;

  /** Academic category of the history being played, if any. */
  category?: SubjectCategory;

  /** Difficulty level of the history, if any. */
  difficulty?: DifficultyLevel;
}
