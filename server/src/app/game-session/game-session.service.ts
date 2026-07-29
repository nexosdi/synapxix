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
