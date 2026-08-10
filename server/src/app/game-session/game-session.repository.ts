import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { StartSessionDto, SubmitAttemptDto } from './dto/game-session.dto';

@Injectable()
export class GameSessionRepository {
  constructor(private prisma: PrismaService) {}

  async createSession(userId: string, dto: StartSessionDto) {
    return this.prisma.gameSession.create({
      data: {
        user_id: userId,
        history_id: dto.historyId,
        category: dto.category,
        status: 'playing',
      }
    });
  }

  async getSession(sessionId: string) {
    return this.prisma.gameSession.findUnique({
      where: { session_id: sessionId }
    });
  }

  /**
   * Sesiones de un usuario con sus intentos, de la más reciente a la más antigua.
   * Es la fuente del reporte por usuario: `game_attempt` ya guarda qué juego se
   * jugó, con qué contenido y cómo le fue.
   */
  async getSessionsWithAttempts(userId: string) {
    return this.prisma.gameSession.findMany({
      where: { user_id: userId },
      orderBy: { started_at: 'desc' },
      include: {
        attempts: {
          orderBy: { created_at: 'asc' },
        },
      },
    });
  }

  async createAttempt(sessionId: string, dto: SubmitAttemptDto) {
    return this.prisma.gameAttempt.create({
      data: {
        session_id: sessionId,
        content_id: dto.contentId,
        game_type: dto.gameType,
        is_correct: dto.isCorrect,
        score: dto.score,
        completed_quickly: dto.completedQuickly ?? null
      }
    });
  }

  async completeSession(sessionId: string) {
    return this.prisma.gameSession.update({
      where: { session_id: sessionId },
      data: {
        status: 'completed',
        finished_at: new Date()
      }
    });
  }
}
