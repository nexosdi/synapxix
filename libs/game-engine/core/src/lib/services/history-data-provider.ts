import { InjectionToken } from '@angular/core';
import { History, SubjectCategory } from '../models/history.model';

/**
 * Contract for providing History data to the HistoryService.
 * 
 * Implementations:
 * - MockHistoryDataProvider: Returns hardcoded mock data (current behavior)
 * - (Future) BackendHistoryDataProvider: Fetches from the NestJS API
 * 
 * This abstraction allows swapping data sources without touching HistoryService.
 */
export interface HistoryDataProvider {
  /**
   * Fetch a single history by its ID.
   * Returns null if the history is not found.
   */
  getHistory(historyId: string): Promise<History | null>;

  /**
   * Fetch all available histories, optionally filtered by category.
   * Used by the category selector views to show available journeys.
   */
  getHistories(filter?: HistoryFilter): Promise<History[]>;
}

export interface HistoryFilter {
  category?: SubjectCategory;
  difficulty?: string;
  gradeLevel?: number;
  tags?: string[];
}

/**
 * Angular injection token for the HistoryDataProvider.
 * 
 * Usage in a module/route:
 *   providers: [
 *     { provide: HISTORY_DATA_PROVIDER, useClass: MockHistoryDataProvider }
 *   ]
 */
export const HISTORY_DATA_PROVIDER = new InjectionToken<HistoryDataProvider>(
  'HISTORY_DATA_PROVIDER'
);
