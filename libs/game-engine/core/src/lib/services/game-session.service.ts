import { Injectable, signal, computed } from '@angular/core';
import { GameSession, GameAttempt, GameProgress } from '../models/game-session.model';
import { AnyGameResult } from '../models/game-result.model';
import { SubjectCategory } from '../models/history.model';

/**
 * Pure data service for game session management.
 *
 * Responsibilities:
 * - Create and manage session lifecycle
 * - Store attempts and compute progress
 *
 * This service does NOT own the state machine or flow transitions.
 * Those responsibilities belong to GameFlowService.
 */
@Injectable({
  providedIn: 'root'
})
export class GameSessionService {
  // Core signals
  private _currentSession = signal<GameSession | null>(null);
  public readonly currentSession = this._currentSession.asReadonly();

  private _attempts = signal<GameAttempt[]>([]);
  public readonly attempts = this._attempts.asReadonly();

  private _expectedTotalGames = signal<number>(0);

  // Computed signal for progress
  public readonly progress = computed<GameProgress | null>(() => {
    const session = this._currentSession();
    if (!session) return null;

    const currentAttempts = this._attempts();
    
    // Calculate simple stats
    const completedGames = currentAttempts.length;
    const correctCount = currentAttempts.filter((a: GameAttempt) => a.isCorrect).length;
    const totalScore = currentAttempts.reduce((acc: number, a: GameAttempt) => acc + a.score, 0);

    return {
      sessionId: session.id,
      totalGames: this._expectedTotalGames(),
      completedGames,
      correctCount,
      totalScore,
      currentIndex: completedGames, // Assume linear progression, index points to the next available content
    };
  });

  /**
   * Initializes a new gaming session
   */
  public startSession(historyId: string, userId: string, totalGames = 0, category?: SubjectCategory, customSessionId?: string): void {
    // Basic local generation, eventually IDs and logic syncs deeply with backend DTOs
    const newSession: GameSession = {
      id: customSessionId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)), 
      historyId,
      userId,
      status: 'playing',
      startedAt: new Date(),
      category,
    };

    this._currentSession.set(newSession);
    this._attempts.set([]);
    this._expectedTotalGames.set(totalGames);
  }

  /**
   * Submit the result of a single minigame attempt
   */
  public submitAttempt(contentId: string, result: AnyGameResult): void {
    const session = this._currentSession();
    if (!session) {
      console.warn('[GameSessionService] Cannot submit attempt: No active session');
      return;
    }

    const attempt: GameAttempt = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      sessionId: session.id,
      contentId,
      gameType: result.gameType,
      answer: result.answer,
      isCorrect: result.isCorrect,
      score: result.score,
      timeSpentMs: result.timeSpentMs,
      completedQuickly: result.timeSpentMs < 60000,
      timestamp: new Date()
    };

    this._attempts.update((attempts: GameAttempt[]) => [...attempts, attempt]);
  }

  /**
   * Marks session as completed.
   * Idempotent — calling this multiple times is safe.
   */
  public completeSession(): void {
    const session = this._currentSession();
    if (!session || session.status === 'completed') return;

    const finishedAt = new Date();
    
    this._currentSession.update((s: GameSession | null) => s ? {
      ...s,
      status: 'completed' as const,
      finishedAt
    } : null);
  }

  /**
   * Helper getter that resolves the signal safely
   */
  public getProgress(): GameProgress | null {
    return this.progress();
  }
}
