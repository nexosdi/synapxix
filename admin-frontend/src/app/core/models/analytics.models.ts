/**
 * Analytics data models shared between the AnalyticsService and teacher dashboard components.
 * All interfaces reflect the shape of the CognitiveMetric DB entity.
 */

/** Single cognitive metric record for one session */
export interface CognitiveMetricRecord {
  id: string;
  sessionId: string;
  userId: string;
  accuracy: number;           // 0.0 – 1.0
  reactionTime: number;       // milliseconds
  cognitiveLoad: number;      // estimated index
  memoryRetention: number | null;
  attentionSpan: number | null;
  createdAt: string;          // ISO date string
}

/** Summary row shown in the student table */
export interface StudentSummary {
  userId: string;
  displayName: string;
  totalSessions: number;
  avgAccuracy: number;        // 0.0 – 1.0
  avgCognitiveLoad: number;
  lastActive: string;         // ISO date string
}

/** Aggregated class-wide averages for the cohort bar chart */
export interface CohortStats {
  avgAccuracy: number;
  avgCognitiveLoad: number;
  avgMemoryRetention: number;
  avgAttentionSpan: number;
  totalStudents: number;
  sessionsThisWeek: number;
}
