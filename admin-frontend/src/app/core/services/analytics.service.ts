import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CohortStats,
  StudentSummary,
  CognitiveMetricRecord,
} from '../models/analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  /**
   * Returns class-wide aggregated cognitive metrics.
   *
   * TODO: Backend must implement GET /api/evaluative/cohort-stats
   *       Expected response shape: CohortStats
   *       { avgAccuracy, avgCognitiveLoad, avgMemoryRetention,
   *         avgAttentionSpan, totalStudents, sessionsThisWeek }
   *
   * Errors are intentionally NOT caught here — they propagate to the
   * component so the error state + retry button are triggered correctly.
   */
  getCohortStats(): Observable<CohortStats> {
    return this.http.get<CohortStats>(`${this.api}/evaluative/cohort-stats`);
  }

  /**
   * Returns the list of students with their aggregated performance summary.
   *
   * TODO: Backend must implement GET /api/evaluative/students
   *       Expected response shape: StudentSummary[]
   *       [{ userId, displayName, totalSessions, avgAccuracy,
   *          avgCognitiveLoad, lastActive }]
   *
   * Errors propagate to the component.
   */
  getStudentList(): Observable<StudentSummary[]> {
    return this.http.get<StudentSummary[]>(`${this.api}/evaluative/students`);
  }

  /**
   * Returns time-series cognitive metrics for a specific student.
   *
   * TODO: Backend must implement GET /api/evaluative/students/:id/metrics
   *       Expected response shape: CognitiveMetricRecord[]
   *       [{ id, sessionId, userId, accuracy, reactionTime, cognitiveLoad,
   *          memoryRetention, attentionSpan, createdAt }]
   *
   * Errors propagate to the component.
   */
  getStudentDetail(userId: string): Observable<CognitiveMetricRecord[]> {
    return this.http.get<CognitiveMetricRecord[]>(
      `${this.api}/evaluative/students/${userId}/metrics`
    );
  }
}
