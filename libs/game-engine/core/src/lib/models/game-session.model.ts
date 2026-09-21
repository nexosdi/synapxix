import { GameType, SubjectCategory } from './history.model';

export type GameSessionStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface GameSession {
  id: string;
  historyId: string;
  userId: string;
  status: GameSessionStatus;
  startedAt: Date;
  finishedAt?: Date;
  category?: SubjectCategory;  // Track which subject this session belongs to
}

export interface GameAttempt<TAnswer = unknown> {
  id: string;
  sessionId: string;
  contentId: string;
  gameType: GameType;
  answer: TAnswer;
  isCorrect: boolean;
  score: number;
  timeSpentMs: number;
  completedQuickly?: boolean;
  timestamp: Date;
}

export interface GameProgress {
  sessionId: string;
  totalGames: number;
  completedGames: number;
  correctCount: number;
  totalScore: number;
  currentIndex: number;
}

export interface GameSessionSummary {
  sessionId: string;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpentMs: number;
  correctPercentage: number;
}

// ── Factories ────────────────────────────────────────────

let sessionModelIdCounter = 0;
const generateMockId = (prefix: string) => `${prefix}-${Date.now()}-${++sessionModelIdCounter}`;

/**
 * Factory to create a GameSession with sensible defaults and optional overrides.
 */
export function createGameSession(overrides?: Partial<GameSession>): GameSession {
  return {
    id: generateMockId('session'),
    historyId: 'history-mock-1',
    userId: 'user-mock-1',
    status: 'playing',
    startedAt: new Date(),
    category: 'lengua',
    ...overrides,
  };
}

/**
 * Factory to create a GameAttempt with sensible defaults and optional overrides.
 */
export function createGameAttempt<TAnswer = unknown>(overrides?: Partial<GameAttempt<TAnswer>>): GameAttempt<TAnswer> {
  return {
    id: generateMockId('attempt'),
    sessionId: 'session-mock-1',
    contentId: 'content-mock-1',
    gameType: 'read-select',
    answer: {} as TAnswer,
    isCorrect: true,
    score: 100,
    timeSpentMs: 1500,
    completedQuickly: false,
    timestamp: new Date(),
    ...overrides,
  };
}

/**
 * Factory to create a GameProgress with sensible defaults and optional overrides.
 */
export function createGameProgress(overrides?: Partial<GameProgress>): GameProgress {
  return {
    sessionId: 'session-mock-1',
    totalGames: 5,
    completedGames: 1,
    correctCount: 1,
    totalScore: 100,
    currentIndex: 1,
    ...overrides,
  };
}

/**
 * Factory to create a GameSessionSummary with sensible defaults and optional overrides.
 */
export function createGameSessionSummary(overrides?: Partial<GameSessionSummary>): GameSessionSummary {
  return {
    sessionId: 'session-mock-1',
    totalScore: 450,
    averageScore: 90,
    bestScore: 100,
    totalTimeSpentMs: 12500,
    correctPercentage: 90,
    ...overrides,
  };
}

