import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { EvaluateSessionDto, GameAttemptRecordDto } from './dto/evaluate-session.dto';

@Injectable()
export class EvaluativeService {
  private readonly logger = new Logger(EvaluativeService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Process the session attempts mathematically to evaluate cognitive performance,
   * then persist the metrics transactionally to avoid DB bottlenecks.
   */
  async evaluateAndPersist(dto: EvaluateSessionDto) {
    this.logger.log(`Evaluating session: ${dto.sessionId}`);

    const { accuracy, reactionTime, cognitiveLoad, memoryRetention, attentionSpan } = this.calculateMetrics(dto.attempts);

    // Write progress, history, and metrics persistently and relationally using Prisma transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Ensure game session is marked as completed (if not already)
      const session = await tx.gameSession.findUnique({
        where: { session_id: dto.sessionId },
      });

      if (session && session.status !== 'completed') {
        await tx.gameSession.update({
          where: { session_id: dto.sessionId },
          data: { status: 'completed', finished_at: new Date() },
        });
      }

      // 2. Insert cognitive metrics
      const metric = await tx.cognitiveMetric.create({
        data: {
          session_id: dto.sessionId,
          user_id: dto.userId || null,
          accuracy,
          reaction_time: reactionTime,
          cognitive_load: cognitiveLoad,
          memory_retention: memoryRetention,
          attention_span: attentionSpan,
        },
      });

      return metric;
    });

    this.logger.log(`Metrics persisted for session: ${dto.sessionId}`);
    return result;
  }

  /**
   * Evaluative Engine: Processes scores mathematically to generate analytical metrics.
   */
  private calculateMetrics(attempts: GameAttemptRecordDto[]) {
    if (!attempts || attempts.length === 0) {
      return {
        accuracy: 0,
        reactionTime: 0,
        cognitiveLoad: 0,
        memoryRetention: 0,
        attentionSpan: 0,
      };
    }

    const totalAttempts = attempts.length;
    let correctCount = 0;
    let totalReactionTime = 0;
    let validReactionCount = 0;
    let quickCount = 0;

    const contentIdsSeen = new Set<string>();
    let repeatedContentCorrect = 0;
    let repeatedContentTotal = 0;

    attempts.forEach((attempt) => {
      if (attempt.isCorrect) correctCount++;
      if (attempt.completedQuickly) quickCount++;

      if (attempt.reactionTimeMs) {
        totalReactionTime += attempt.reactionTimeMs;
        validReactionCount++;
      }

      if (contentIdsSeen.has(attempt.contentId)) {
        repeatedContentTotal++;
        if (attempt.isCorrect) repeatedContentCorrect++;
      }
      contentIdsSeen.add(attempt.contentId);
    });

    // 1. Accuracy (0.0 to 1.0)
    const accuracy = correctCount / totalAttempts;

    // 2. Reaction Time (Average in milliseconds, fallback to heuristics if missing)
    let reactionTime = 0;
    if (validReactionCount > 0) {
      reactionTime = totalReactionTime / validReactionCount;
    } else {
      // Heuristic: if completed quickly, estimate 1500ms, else 3000ms
      reactionTime = quickCount > (totalAttempts / 2) ? 1500 : 3000;
    }

    // 3. Cognitive Load (Estimated index: higher reaction times and more mistakes = higher cognitive load)
    // Formula heuristic: (1 - accuracy) * 50 + (reactionTime / 1000) * 10
    const cognitiveLoad = ((1 - accuracy) * 50) + ((reactionTime / 1000) * 10);

    // 4. Memory Retention (Accuracy on repeated content)
    let memoryRetention = null;
    if (repeatedContentTotal > 0) {
      memoryRetention = repeatedContentCorrect / repeatedContentTotal;
    }

    // 5. Attention Span (Heuristic based on sustained accuracy over time)
    // For simplicity, attention span decreases if they miss more in the second half
    let attentionSpan = null;
    if (totalAttempts > 4) {
      const half = Math.floor(totalAttempts / 2);
      const secondHalf = attempts.slice(half);
      const secondHalfCorrect = secondHalf.filter(a => a.isCorrect).length;
      attentionSpan = secondHalfCorrect / secondHalf.length;
    }

    return {
      accuracy,
      reactionTime,
      cognitiveLoad,
      memoryRetention,
      attentionSpan,
    };
  }
}
