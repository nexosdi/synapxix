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
  async evaluateAndPersist(dto: EvaluateSessionDto & { userId: string }) {
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
   * Transforms the AI's semantic/phonetic analysis into standardized database metrics
   * and persists them in the evaluative engine.
   *
   * @param userId - The ID of the user being evaluated.
   * @param sessionId - The game session ID.
   * @param aiAnalysisResult - The raw text or JSON string returned by the AiProvider.
   */
  async transformAiToMetricsAndPersist(userId: string, sessionId: string, aiAnalysisResult: string) {
    this.logger.log(`Evaluating AI-driven metrics for session: ${sessionId}`);

    let accuracy = 0.5;
    let cognitiveLoad = 50;

    // Data Transformation: Parse AI evaluation into numeric metrics
    try {
      // Attempt to parse structured phonetic JSON from AI audio analysis
      const parsed = JSON.parse(aiAnalysisResult);
      accuracy = parsed.isCorrect ? 1.0 : 0.0;
      if (typeof parsed.score === 'number') {
         accuracy = parsed.score / 100; // Convert 0-100 scale to 0.0-1.0 scale
      }
      // Heuristic translation: Lower accuracy correlates to higher cognitive load
      cognitiveLoad = (1 - accuracy) * 100; 
    } catch {
      // Fallback to text parsing: Semantic analysis heuristic for open text responses
      const lowerResp = aiAnalysisResult.toLowerCase();
      if (lowerResp.includes('excellent') || lowerResp.includes('strength') || lowerResp.includes('correct')) {
         accuracy = 0.9;
         cognitiveLoad = 20;
      } else if (lowerResp.includes('weakness') || lowerResp.includes('incorrect') || lowerResp.includes('struggle')) {
         accuracy = 0.3;
         cognitiveLoad = 80;
      }
    }

    // Persist as a single evaluated attempt outcome
    const metric = await this.prisma.$transaction(async (tx) => {
      // 1. Ensure game session is marked as completed
      const session = await tx.gameSession.findUnique({
        where: { session_id: sessionId },
      });

      if (session && session.status !== 'completed') {
        await tx.gameSession.update({
          where: { session_id: sessionId },
          data: { status: 'completed', finished_at: new Date() },
        });
      }

      // 2. Insert cognitive metrics translated from the AI evaluation
      const newMetric = await tx.cognitiveMetric.create({
        data: {
          session_id: sessionId,
          user_id: userId || null,
          accuracy,
          reaction_time: 2000, // Estimated mean reaction time for AI tasks
          cognitive_load: cognitiveLoad,
          memory_retention: null,
          attention_span: null,
        },
      });

      return newMetric;
    });

    this.logger.log(`AI-driven metrics persisted for session: ${sessionId}`);
    return metric;
  }

  /**
   * Retrieves aggregated cohort metrics for all students.
   */
  async getCohortStats() {
    // 1. Get average metrics across all cognitive metrics in the db
    const aggregations = await this.prisma.cognitiveMetric.aggregate({
      _avg: {
        accuracy: true,
        cognitive_load: true,
        memory_retention: true,
        attention_span: true,
      },
    });

    // 2. Count unique users who have metrics
    const uniqueUsers = await this.prisma.cognitiveMetric.groupBy({
      by: ['user_id'],
      where: {
        user_id: { not: null },
      },
    });
    const totalStudents = uniqueUsers.length;

    // 3. Count sessions created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sessionsThisWeek = await this.prisma.cognitiveMetric.count({
      where: {
        created_at: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      avgAccuracy: aggregations._avg.accuracy ?? 0,
      avgCognitiveLoad: aggregations._avg.cognitive_load ?? 0,
      avgMemoryRetention: aggregations._avg.memory_retention ?? 0,
      avgAttentionSpan: aggregations._avg.attention_span ?? 0,
      totalStudents,
      sessionsThisWeek,
    };
  }

  /**
   * Retrieves summaries of performance metrics for all students.
   */
  async getStudentList() {
    const users = await this.prisma.app_user.findMany({
      where: {
        role: { in: ['user', 'student'] },
      },
      include: {
        cognitiveMetrics: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    return users.map((user) => {
      const metrics = user.cognitiveMetrics;
      const totalSessions = metrics.length;

      let avgAccuracy = 0;
      let avgCognitiveLoad = 0;
      let lastActive = user.created_at.toISOString();

      if (totalSessions > 0) {
        const sumAccuracy = metrics.reduce((sum, m) => sum + m.accuracy, 0);
        const sumCogLoad = metrics.reduce((sum, m) => sum + m.cognitive_load, 0);
        avgAccuracy = sumAccuracy / totalSessions;
        avgCognitiveLoad = sumCogLoad / totalSessions;
        lastActive = metrics[0].created_at.toISOString();
      }

      return {
        userId: user.user_id,
        displayName: `${user.firstname} ${user.lastname}`.trim() || user.username || 'Anonymous Student',
        totalSessions,
        avgAccuracy,
        avgCognitiveLoad,
        lastActive,
      };
    });
  }

  /**
   * Retrieves individual cognitive metrics history for a specific student.
   */
  async getStudentDetail(userId: string) {
    const metrics = await this.prisma.cognitiveMetric.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
    });

    return metrics.map((m) => ({
      id: m.metric_id,
      sessionId: m.session_id,
      userId: m.user_id,
      accuracy: m.accuracy,
      reactionTime: m.reaction_time,
      cognitiveLoad: m.cognitive_load,
      memoryRetention: m.memory_retention,
      attentionSpan: m.attention_span,
      createdAt: m.created_at.toISOString(),
    }));
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
