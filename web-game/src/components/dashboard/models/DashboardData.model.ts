/**
 * Refleja el DTO `BalanceResponseDto` del backend (economy/dto/balance-response.dto.ts).
 * GET /api/economy/balance
 */
export interface BalanceData {
  credits: number;
  experience_points: number;
}

/**
 * Refleja el DTO `IndividualCognitiveAverageDto` del backend (analytics/dto).
 * GET /api/analytics/individual-average/:userId
 * Los valores son proporciones 0–1, excepto reaction_time (ms).
 */
export interface CognitiveMetrics {
  user_id: string;
  accuracy: number;
  reaction_time: number;
  cognitive_load: number;
  memory_retention: number;
  attention_span: number;
}

/**
 * Refleja el DTO `StudentProgressDto` del backend (analytics/dto).
 * GET /api/analytics/student-progress/:studentId
 * progress es una proporción 0–1.
 */
export interface StudentProgressData {
  student_id: string;
  progress: number;
}
