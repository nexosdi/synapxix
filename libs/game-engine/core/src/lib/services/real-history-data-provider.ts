import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HistoryDataProvider, HistoryFilter } from './history-data-provider';
import { History } from '../models/history.model';
import { HISTORY_MOCK } from '../history-mock';

// These interfaces should match the backend DTOs
interface GameAttempt {
  attempt_id: string;
  content_id: string;
  game_type: string;
  is_correct: boolean;
  score: number;
  completed_quickly: boolean;
  created_at: string;
}

interface GameSession {
  session_id: string;
  user_id: string;
  history_id: string;
  category: string;
  status: 'playing' | 'completed';
  started_at: string;
  finished_at: string | null;
  attempts: GameAttempt[];
}

@Injectable()
export class RealHistoryDataProvider implements HistoryDataProvider {
  constructor(private http: HttpClient) {}

  async getHistory(sessionId: string): Promise<History | null> {
    try {
      // 1. Fetch the session results from the backend
      const session = await lastValueFrom(this.http.get<GameSession>(`/api/game-session/${sessionId}`));
      if (!session) {
        return null;
      }

      // 2. The backend doesn't yet serve history templates, so we use the mock as a base.
      // This assumes the session's history_id corresponds to the mock's ID.
      if (session.history_id !== HISTORY_MOCK.id) {
        console.error(
          `[RealHistoryDataProvider] Error: Session's history_id "${session.history_id}" does not match the available mock history ID "${HISTORY_MOCK.id}". Cannot merge results.`
        );
        // As a fallback, we could return the plain mock, but it won't have the results.
        // Returning null is safer to indicate that the requested data couldn't be fully constructed.
        return null;
      }

      // 3. Deep clone the mock to avoid modifying the original object in other parts of the app.
      const historyTemplate: History = JSON.parse(JSON.stringify(HISTORY_MOCK));

      // 4. Create a map of attempts by their content_id for efficient lookup.
      const attemptsMap = new Map<string, GameAttempt>();
      for (const attempt of session.attempts) {
        attemptsMap.set(attempt.content_id, attempt);
      }

      // 5. Augment the contentMap nodes with the result from the corresponding attempt.
      for (const content of historyTemplate.contentMap) {
        const attempt = attemptsMap.get(content.id);
        if (attempt) {
          content.result = {
            isCorrect: attempt.is_correct,
            score: attempt.score,
          };
        }
      }

      // 6. The ID of the final History object should be the session ID, as that's what the route uses.
      historyTemplate.id = sessionId;

      return historyTemplate;
    } catch (error) {
      console.error('[RealHistoryDataProvider] Failed to fetch or process history data:', error);
      return null;
    }
  }

  async getHistories(filter?: HistoryFilter): Promise<History[]> {
    // There is no backend endpoint to list all histories/journeys yet.
    // Returning an empty array as a placeholder.
    console.warn('[RealHistoryDataProvider] getHistories is not implemented yet, returning empty array.');
    return [];
  }
}
