import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { GameSessionRepository } from './game-session.repository';
import { StartSessionDto, SubmitAttemptDto } from './dto/game-session.dto';

@Injectable()
export class GameSessionService {
  constructor(private readonly repository: GameSessionRepository) {}

  async startSession(userId: string, dto: StartSessionDto) {
    const session = await this.repository.createSession(userId, dto);
    return { sessionId: session.session_id };
  }

  async submitAttempt(userId: string, sessionId: string, dto: SubmitAttemptDto) {
    // Verificar si la sesión existe
    const session = await this.repository.getSession(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    if (session.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta sesión');
    }

    const attempt = await this.repository.createAttempt(sessionId, dto);
    return { attemptId: attempt.attempt_id, completedQuickly: attempt.completed_quickly };
  }

  /**
   * Reporte de actividad de un usuario: qué juegos jugó y cómo le fue.
   *
   * Devuelve tres niveles de detalle sobre los mismos datos: un resumen global,
   * un desglose por tipo de juego y el listado de sesiones con sus intentos.
   *
   * Nota: describe resultados (acertó / puntaje), no conducta. No dice si leyó
   * las instrucciones, si reintentó o si pidió ayuda, porque `game_attempt` no
   * captura esos eventos todavía.
   */
  async getUserReport(userId: string) {
    const sessions = await this.repository.getSessionsWithAttempts(userId);
    const attempts = sessions.flatMap((session) => session.attempts);

    const correctAttempts = attempts.filter((a) => a.is_correct).length;

    const byGameType = new Map<
      string,
      { gameType: string; attempts: number; correct: number; totalScore: number; lastPlayedAt: Date }
    >();

    for (const attempt of attempts) {
      const entry = byGameType.get(attempt.game_type) ?? {
        gameType: attempt.game_type,
        attempts: 0,
        correct: 0,
        totalScore: 0,
        lastPlayedAt: attempt.created_at,
      };

      entry.attempts += 1;
      entry.correct += attempt.is_correct ? 1 : 0;
      entry.totalScore += attempt.score;
      if (attempt.created_at > entry.lastPlayedAt) {
        entry.lastPlayedAt = attempt.created_at;
      }

      byGameType.set(attempt.game_type, entry);
    }

    return {
      userId,
      summary: {
        totalSessions: sessions.length,
        completedSessions: sessions.filter((s) => s.status === 'completed').length,
        totalAttempts: attempts.length,
        correctAttempts,
        accuracy: attempts.length > 0 ? correctAttempts / attempts.length : 0,
      },
      gamesPlayed: [...byGameType.values()]
        .map((entry) => ({
          gameType: entry.gameType,
          attempts: entry.attempts,
          correct: entry.correct,
          accuracy: entry.correct / entry.attempts,
          averageScore: entry.totalScore / entry.attempts,
          lastPlayedAt: entry.lastPlayedAt,
        }))
        .sort((a, b) => b.lastPlayedAt.getTime() - a.lastPlayedAt.getTime()),
      sessions: sessions.map((session) => ({
        sessionId: session.session_id,
        historyId: session.history_id,
        category: session.category,
        status: session.status,
        startedAt: session.started_at,
        finishedAt: session.finished_at,
        attempts: session.attempts.map((attempt) => ({
          attemptId: attempt.attempt_id,
          gameType: attempt.game_type,
          contentId: attempt.content_id,
          isCorrect: attempt.is_correct,
          score: attempt.score,
          completedQuickly: attempt.completed_quickly,
          createdAt: attempt.created_at,
        })),
      })),
    };
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.repository.getSession(sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    if (session.user_id !== userId) {
      throw new ForbiddenException('No tienes acceso a esta sesión');
    }

    const completedSession = await this.repository.completeSession(sessionId);
    return {
      sessionId: completedSession.session_id
    };
  }
}
