/**
 * Configuration for the game flow timing.
 * These values control the delays between state transitions.
 * Can be overridden per-game-type or globally.
 */
export interface GameFlowConfig {
  /** Delay between READY and PLAYING states (ms). Gives the user a visual breath. */
  readyToPlayDelayMs: number;

  /** Delay between ANSWERING and FEEDBACK states (ms). Shows processing state. */
  answerToFeedbackDelayMs: number;

  /** Auto-advance from FEEDBACK to next game (ms). Set to 0 to disable auto-advance. */
  feedbackAutoAdvanceMs: number;
}

export const DEFAULT_FLOW_CONFIG: GameFlowConfig = {
  readyToPlayDelayMs: 300,
  answerToFeedbackDelayMs: 800,
  feedbackAutoAdvanceMs: 0,
};
