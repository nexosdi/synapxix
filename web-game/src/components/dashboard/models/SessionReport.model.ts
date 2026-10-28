/**
 * Forma del resumen de sesiones que devuelve GET /api/game-session/me/report
 * Solo se toma el subobjeto `summary` que es lo relevante para el dashboard.
 */
export interface SessionSummary {
  totalSessions: number;
  completedSessions: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
}

/**
 * Respuesta completa de GET /api/game-session/me/report.
 * Se declara solo lo que el dashboard consume.
 */
export interface UserReportData {
  userId: string;
  summary: SessionSummary;
}
