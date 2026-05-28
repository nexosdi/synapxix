export interface CognitiveEvaluationMetrics {
  cognitiveScore: number;
  attentionIndex: number;
  memoryIndex: number;
  processingSpeed: number;
  consistency: number;
  accuracy: number;
  details?: Record<string, unknown>;
}

export interface MotorEvaluationMetrics {
  motorScore: number;
  coordinationIndex: number;
  reactionIndex: number;
  controlIndex: number;
  accuracy: number;
  details?: Record<string, unknown>;
}

export interface CognitiveEvaluationInput {
  gameSessionId: string;
  historyId: string;
  gameType: string;
  category: string;
  durationSeconds: number;
  score: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  hintsUsed: number;
  averageResponseTimeMs: number;
  taskComplexity: number;
  details?: Record<string, unknown>;
}

export interface MotorEvaluationInput {
  gameSessionId: string;
  historyId: string;
  gameType: string;
  category: string;
  durationSeconds: number;
  score: number;
  accuracy: number;
  movementPrecision: number;
  reactionTimeMs: number;
  completionRate: number;
  controlStability: number;
  details?: Record<string, unknown>;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function computeCognitiveMetrics(input: CognitiveEvaluationInput): CognitiveEvaluationMetrics {
  const accuracyScore = clamp(input.accuracy, 0, 100);
  const basePerformance = input.score / Math.max(1, input.durationSeconds);
  const attentionIndex = clamp((input.correctAnswers / Math.max(1, input.correctAnswers + input.wrongAnswers)) * 100);
  const memoryIndex = clamp((100 - input.hintsUsed * 5) * (input.taskComplexity / 10));
  const processingSpeed = clamp(100 - input.averageResponseTimeMs / 10);
  const consistency = clamp((input.correctAnswers - input.wrongAnswers) / Math.max(1, input.correctAnswers + input.wrongAnswers) * 100 + 50);
  const cognitiveScore = clamp(
    accuracyScore * 0.4 +
      attentionIndex * 0.2 +
      memoryIndex * 0.2 +
      processingSpeed * 0.2
  );

  return {
    cognitiveScore,
    attentionIndex,
    memoryIndex,
    processingSpeed,
    consistency,
    accuracy: accuracyScore,
    details: {
      basePerformance: Number(basePerformance.toFixed(3)),
      correctAnswers: input.correctAnswers,
      wrongAnswers: input.wrongAnswers,
      hintsUsed: input.hintsUsed,
      averageResponseTimeMs: input.averageResponseTimeMs,
      taskComplexity: input.taskComplexity,
      ...input.details,
    },
  };
}

export function computeMotorMetrics(input: MotorEvaluationInput): MotorEvaluationMetrics {
  const accuracyScore = clamp(input.accuracy, 0, 100);
  const precisionFactor = clamp(input.movementPrecision);
  const reactionIndex = clamp(100 - input.reactionTimeMs / 10);
  const coordinationIndex = clamp((precisionFactor + input.controlStability + input.completionRate) / 3);
  const controlIndex = clamp((precisionFactor * 0.5 + input.controlStability * 0.3 + reactionIndex * 0.2));
  const motorScore = clamp(accuracyScore * 0.35 + coordinationIndex * 0.35 + controlIndex * 0.3);

  return {
    motorScore,
    coordinationIndex,
    reactionIndex,
    controlIndex,
    accuracy: accuracyScore,
    details: {
      movementPrecision: input.movementPrecision,
      reactionTimeMs: input.reactionTimeMs,
      completionRate: input.completionRate,
      controlStability: input.controlStability,
      ...input.details,
    },
  };
}
