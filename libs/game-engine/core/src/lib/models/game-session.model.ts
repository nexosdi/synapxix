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

export interface GameAttempt<TAnswer = any> {
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
