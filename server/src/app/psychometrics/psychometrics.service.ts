import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PsychometricsRepository } from './psychometrics.repository';
import { CreateCognitiveEvaluationDto } from './dto/create-cognitive-evaluation.dto';
import { CreateMotorEvaluationDto } from './dto/create-motor-evaluation.dto';
import {
  computeCognitiveMetrics,
  computeMotorMetrics,
} from './logic/psychometrics.logic';

@Injectable()
export class PsychometricsService {
  private readonly logger = new Logger(PsychometricsService.name);

  constructor(private readonly repository: PsychometricsRepository) {}

  async processCognitiveEvaluation(userId: string, dto: CreateCognitiveEvaluationDto) {
    const metrics = computeCognitiveMetrics(dto);
    const payload = {
      gameSessionId: dto.gameSessionId,
      historyId: dto.historyId,
      gameType: dto.gameType,
      category: dto.category,
      durationSeconds: dto.durationSeconds,
      score: dto.score,
      accuracy: dto.accuracy,
      startedAt: new Date(),
      endedAt: new Date(),
      details: dto.details,
    };

    try {
      const result = await this.repository.createCognitiveEvaluationSession(userId, payload, metrics);
      return {
        evaluationSessionId: result.session.evaluation_session_id,
        gameSessionId: result.session.game_session_id,
        metrics: {
          cognitiveScore: metrics.cognitiveScore,
          attentionIndex: metrics.attentionIndex,
          memoryIndex: metrics.memoryIndex,
          processingSpeed: metrics.processingSpeed,
          consistency: metrics.consistency,
          accuracy: metrics.accuracy,
        },
        profile: {
          cognitiveBalance: result.profile.cognitive_balance,
          cognitiveSessions: result.profile.cognitive_sessions,
        },
      };
    } catch (error) {
      this.logger.error('Error processing cognitive evaluation', error);
      throw new InternalServerErrorException('Unable to persist cognitive analysis');
    }
  }

  async processMotorEvaluation(userId: string, dto: CreateMotorEvaluationDto) {
    const metrics = computeMotorMetrics(dto);
    const payload = {
      gameSessionId: dto.gameSessionId,
      historyId: dto.historyId,
      gameType: dto.gameType,
      category: dto.category,
      durationSeconds: dto.durationSeconds,
      score: dto.score,
      accuracy: dto.accuracy,
      startedAt: new Date(),
      endedAt: new Date(),
      details: dto.details,
    };

    try {
      const result = await this.repository.createMotorEvaluationSession(userId, payload, metrics);
      return {
        evaluationSessionId: result.session.evaluation_session_id,
        gameSessionId: result.session.game_session_id,
        metrics: {
          motorScore: metrics.motorScore,
          coordinationIndex: metrics.coordinationIndex,
          reactionIndex: metrics.reactionIndex,
          controlIndex: metrics.controlIndex,
          accuracy: metrics.accuracy,
        },
        profile: {
          motorBalance: result.profile.motor_balance,
          motorSessions: result.profile.motor_sessions,
        },
      };
    } catch (error) {
      this.logger.error('Error processing motor evaluation', error);
      throw new InternalServerErrorException('Unable to persist motor analysis');
    }
  }
}
