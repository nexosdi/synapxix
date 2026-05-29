import { Injectable } from '@angular/core';
import { HistoryDataProvider, HistoryFilter } from './history-data-provider';
import { History } from '../models/history.model';
import { HISTORY_MOCK } from '../history-mock';

/**
 * Mock implementation of HistoryDataProvider.
 * Returns hardcoded data for development and testing.
 * 
 * Replace with BackendHistoryDataProvider when the API is ready:
 *   { provide: HISTORY_DATA_PROVIDER, useClass: BackendHistoryDataProvider }
 */
@Injectable()
export class MockHistoryDataProvider implements HistoryDataProvider {
  
  // All available mock histories. Add more here for testing different categories.
  private readonly mockHistories: History[] = [
    HISTORY_MOCK,
    // Example: you can add more mock histories for different subjects:
    // MATH_HISTORY_MOCK,
    // LANGUAGE_HISTORY_MOCK,
  ];

  async getHistory(historyId: string): Promise<History | null> {
    return this.mockHistories.find(h => h.id === historyId) ?? null;
  }

  async getHistories(filter?: HistoryFilter): Promise<History[]> {
    let results = [...this.mockHistories];

    if (filter?.category) {
      results = results.filter(h => h.category === filter.category);
    }
    if (filter?.difficulty) {
      results = results.filter(h => h.difficulty === filter.difficulty);
    }
    if (filter?.gradeLevel !== undefined) {
      results = results.filter(h => h.gradeLevel === filter.gradeLevel);
    }
    if (filter?.tags?.length) {
      results = results.filter(h => 
        filter.tags!.some(tag => h.tags?.includes(tag))
      );
    }

    return results;
  }
}
