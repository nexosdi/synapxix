import { TestBed } from '@angular/core/testing';
import { MockHistoryDataProvider } from './mock-history-data-provider';
import { HISTORY_MOCK } from '../history-mock';

describe('MockHistoryDataProvider', () => {
  let provider: MockHistoryDataProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockHistoryDataProvider]
    });
    provider = TestBed.inject(MockHistoryDataProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getHistory()', () => {
    it('should return HISTORY_MOCK when requesting its ID', async () => {
      const result = await provider.getHistory(HISTORY_MOCK.id);
      expect(result).toEqual(HISTORY_MOCK);
    });

    it('should return null for unknown IDs', async () => {
      const result = await provider.getHistory('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('getHistories()', () => {
    it('should return all mocks when no filter is provided', async () => {
      const results = await provider.getHistories();
      expect(results.length).toBeGreaterThan(0);
      expect(results).toContain(HISTORY_MOCK);
    });

    it('should filter by category', async () => {
      const results = await provider.getHistories({ category: HISTORY_MOCK.category });
      expect(results).toContain(HISTORY_MOCK);
      
      const noResults = await provider.getHistories({ category: 'non-existent-category' as any });
      expect(noResults.length).toBe(0);
    });

    it('should filter by difficulty', async () => {
      if (HISTORY_MOCK.difficulty) {
        const results = await provider.getHistories({ difficulty: HISTORY_MOCK.difficulty });
        expect(results).toContain(HISTORY_MOCK);
      }
    });
  });
});
