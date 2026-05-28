import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import {
  CognitiveEvaluationMetrics,
  MotorEvaluationMetrics,
} from './logic/psychometrics.logic';

@Injectable()
export class PsychometricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCognitiveEvaluationSession(
    userId: string,
    dto: {
      gameSessionId: string;
      historyId: string;
      gameType: string;
      category: string;
      durationSeconds: number;
      score: number;
      accuracy: number;
      startedAt: Date;
      endedAt: Date;
      details?: Record<string, unknown>;
    },
    metrics: CognitiveEvaluationMetrics
  ) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.gameEvaluationSession.create({
        data: {
          user_id: userId,
          game_session_id: dto.gameSessionId,
          history_id: dto.historyId,
          game_type: dto.gameType,
          category: dto.category,
          started_at: dto.startedAt,
          ended_at: dto.endedAt,
          duration_seconds: dto.durationSeconds,
          raw_score: dto.score,
          accuracy: dto.accuracy,
        },
      });

      const cognitiveMetric = await tx.cognitiveMetric.create({
        data: {
          evaluation_session_id: session.evaluation_session_id,
          user_id: userId,
          game_session_id: dto.gameSessionId,
          cognitive_score: metrics.cognitiveScore,
          attention_index: metrics.attentionIndex,
          memory_index: metrics.memoryIndex,
          processing_speed: metrics.processingSpeed,
          consistency: metrics.consistency,
          accuracy: metrics.accuracy,
          details: metrics.details,
        },
      });

      const profile = await tx.userPsychometricProfile.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          cognitive_balance: metrics.cognitiveScore,
          motor_balance: 0,
          cognitive_sessions: 1,
          motor_sessions: 0,
        },
        update: {
          cognitive_balance: { increment: metrics.cognitiveScore },
          cognitive_sessions: { increment: 1 },
          last_updated: new Date(),
        },
      });

      return {
        session,
        metric: cognitiveMetric,
        profile,
      };
    });
  }

  async createMotorEvaluationSession(
    userId: string,
    dto: {
      gameSessionId: string;
      historyId: string;
      gameType: string;
      category: string;
      durationSeconds: number;
      score: number;
      accuracy: number;
      startedAt: Date;
      endedAt: Date;
      details?: Record<string, unknown>;
    },
    metrics: MotorEvaluationMetrics
  ) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.gameEvaluationSession.create({
        data: {
          user_id: userId,
          game_session_id: dto.gameSessionId,
          history_id: dto.historyId,
          game_type: dto.gameType,
          category: dto.category,
          started_at: dto.startedAt,
          ended_at: dto.endedAt,
          duration_seconds: dto.durationSeconds,
          raw_score: dto.score,
          accuracy: dto.accuracy,
        },
      });

      const motorMetric = await tx.motorMetric.create({
        data: {
          evaluation_session_id: session.evaluation_session_id,
          user_id: userId,
          game_session_id: dto.gameSessionId,
          motor_score: metrics.motorScore,
          coordination_index: metrics.coordinationIndex,
          reaction_index: metrics.reactionIndex,
          control_index: metrics.controlIndex,
          accuracy: metrics.accuracy,
          details: metrics.details,
        },
      });

      const profile = await tx.userPsychometricProfile.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          cognitive_balance: 0,
          motor_balance: metrics.motorScore,
          cognitive_sessions: 0,
          motor_sessions: 1,
        },
        update: {
          motor_balance: { increment: metrics.motorScore },
          motor_sessions: { increment: 1 },
          last_updated: new Date(),
        },
      });

      return {
        session,
        metric: motorMetric,
        profile,
      };
    });
  }
}
