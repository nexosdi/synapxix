import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { HISTORY_DATA_PROVIDER, HistoryDataProvider } from './history-data-provider';
import { History, InteractiveContent } from '../models/history.model';
import { HISTORY_MOCK } from '../history-mock';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_CONTENT_MAP: InteractiveContent[] = [
  { id: 'game-1', gameType: 'read-select', gameInput: { prompt: 'Pick one', options: [], minCorrectToPass: 1, timeLimitSec: 30, locale: 'en-US' } },
  { id: 'game-2', gameType: 'fill-in-the-blanks', gameInput: { sentence: 'The ___ jumps.', blanks: [], locale: 'en-US' } },
  { id: 'game-3', gameType: 'intruder', gameInput: { prompt: 'Find the odd one', options: [], locale: 'es-AR' } },
];

const FAKE_HISTORY: History = {
  id: 'test-history',
  name: 'Test Journey',
  description: 'A test history with 3 games',
  originalContent: { id: 'orig-1', type: 'text', content: { text: 'Hello' } },
  contentMap: MOCK_CONTENT_MAP,
  path: ['game-1', 'game-2', 'game-3'],
  category: 'general',
  difficulty: 'beginner',
  gradeLevel: 1,
  tags: ['test'],
};

const ANOTHER_HISTORY: History = {
  ...FAKE_HISTORY,
  id: 'math-history',
  name: 'Math Journey',
  category: 'matematica',
};

function createMockProvider(histories: History[] = [FAKE_HISTORY]): HistoryDataProvider {
  return {
    getHistory: jest.fn(async (id: string) =>
      histories.find((h) => h.id === id) ?? null
    ),
    getHistories: jest.fn(async (filter?) => {
      if (!filter) return histories;
      let result = [...histories];
      if (filter.category) result = result.filter((h) => h.category === filter.category);
      if (filter.difficulty) result = result.filter((h) => h.difficulty === filter.difficulty);
      if (filter.gradeLevel !== undefined) result = result.filter((h) => h.gradeLevel === filter.gradeLevel);
      if (filter.tags?.length) result = result.filter((h) => filter.tags?.some((t) => h.tags?.includes(t)));
      return result;
    }),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HistoryService', () => {
  describe('with HistoryDataProvider', () => {
    let service: HistoryService;
    let provider: HistoryDataProvider;

    beforeEach(() => {
      provider = createMockProvider([FAKE_HISTORY, ANOTHER_HISTORY]);
      TestBed.configureTestingModule({
        providers: [
          HistoryService,
          { provide: HISTORY_DATA_PROVIDER, useValue: provider },
        ],
      });
      service = TestBed.inject(HistoryService);
    });

    // ── Initial state ──────────────────────────────────────────────────────────

    describe('initial state', () => {
      it('should have no histories loaded', () => {
        expect(service.histories()).toEqual([]);
      });

      it('should have no active history', () => {
        expect(service.activeHistory()).toBeNull();
      });

      it('should have null currentContent (journey not started)', () => {
        expect(service.currentContent()).toBeNull();
      });

      it('should report isJourneyComplete as false', () => {
        expect(service.isJourneyComplete()).toBe(false);
      });

      it('should report hasNextContent as false', () => {
        expect(service.hasNextContent()).toBe(false);
      });

      it('getCurrentContentIndex() should be 0', () => {
        expect(service.getCurrentContentIndex()).toBe(0);
      });

      it('getTotalContent() should be 0', () => {
        expect(service.getTotalContent()).toBe(0);
      });
    });

    // ── loadHistory() ──────────────────────────────────────────────────────────

    describe('loadHistory()', () => {
      it('should return true and activate the history when found', async () => {
        const result = await service.loadHistory('test-history');

        expect(result).toBe(true);
        expect(provider.getHistory).toHaveBeenCalledWith('test-history');
        expect(service.activeHistory()?.id).toBe('test-history');
        expect(service.activeHistory()?.name).toBe('Test Journey');
      });

      it('should populate the histories signal with the loaded history', async () => {
        await service.loadHistory('test-history');

        expect(service.histories().length).toBe(1);
        expect(service.histories()[0].id).toBe('test-history');
      });

      it('should return false and leave state unchanged for a non-existent ID', async () => {
        const result = await service.loadHistory('does-not-exist');

        expect(result).toBe(false);
        expect(service.activeHistory()).toBeNull();
        expect(service.histories()).toEqual([]);
      });

      it('should reset journey state when a new history is loaded', async () => {
        // Load and start a journey
        await service.loadHistory('test-history');
        service.beginJourney();
        service.advanceToNext();
        expect(service.getCurrentContentIndex()).toBe(1);

        // Load again — journey should reset
        await service.loadHistory('test-history');
        expect(service.getCurrentContentIndex()).toBe(0);
        expect(service.currentContent()).toBeNull(); // journey not started yet
      });

      it('should switch the active history when loading a different one', async () => {
        await service.loadHistory('test-history');
        expect(service.activeHistory()?.id).toBe('test-history');

        await service.loadHistory('math-history');
        expect(service.activeHistory()?.id).toBe('math-history');
      });
    });

    // ── loadHistories() ────────────────────────────────────────────────────────

    describe('loadHistories()', () => {
      it('should load all available histories without a filter', async () => {
        const result = await service.loadHistories();

        expect(provider.getHistories).toHaveBeenCalledWith(undefined);
        expect(result.length).toBe(2);
        expect(service.histories().length).toBe(2);
      });

      it('should pass the category filter to the provider', async () => {
        const result = await service.loadHistories({ category: 'matematica' });

        expect(provider.getHistories).toHaveBeenCalledWith({ category: 'matematica' });
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('math-history');
      });

      it('should update the histories signal with the filtered result', async () => {
        await service.loadHistories({ category: 'general' });

        expect(service.histories().length).toBe(1);
        expect(service.histories()[0].id).toBe('test-history');
      });
    });

    // ── getHistoriesByCategory() ───────────────────────────────────────────────

    describe('getHistoriesByCategory()', () => {
      it('should delegate to loadHistories with the category filter', async () => {
        const result = await service.getHistoriesByCategory('matematica');

        expect(provider.getHistories).toHaveBeenCalledWith({ category: 'matematica' });
        expect(result.length).toBe(1);
      });
    });

    // ── beginJourney() ─────────────────────────────────────────────────────────

    describe('beginJourney()', () => {
      it('should return the first content item after loading', async () => {
        await service.loadHistory('test-history');

        const first = service.beginJourney();

        expect(first).not.toBeNull();
        expect(first?.id).toBe('game-1');
      });

      it('should set currentContent to the first item', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        expect(service.currentContent()?.id).toBe('game-1');
      });

      it('should set getCurrentContentIndex to 0', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        expect(service.getCurrentContentIndex()).toBe(0);
      });

      it('should return null when no history is loaded', () => {
        const result = service.beginJourney();

        expect(result).toBeNull();
        expect(service.currentContent()).toBeNull();
      });

      it('should set hasNextContent to true when there are more games', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        expect(service.hasNextContent()).toBe(true);
      });
    });

    // ── advanceToNext() ────────────────────────────────────────────────────────

    describe('advanceToNext()', () => {
      it('should advance and return the next content item', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        const second = service.advanceToNext();

        expect(second).not.toBeNull();
        expect(second?.id).toBe('game-2');
        expect(service.getCurrentContentIndex()).toBe(1);
        expect(service.currentContent()?.id).toBe('game-2');
      });

      it('should advance through all items correctly', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        expect(service.advanceToNext()?.id).toBe('game-2');
        expect(service.advanceToNext()?.id).toBe('game-3');
      });

      it('should return null when reaching the end of the contentMap', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        service.advanceToNext(); // → game-2
        service.advanceToNext(); // → game-3
        const result = service.advanceToNext(); // → past end

        expect(result).toBeNull();
      });

      it('should mark isJourneyComplete as true when past the end', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        service.advanceToNext();
        service.advanceToNext();
        service.advanceToNext(); // past end

        expect(service.isJourneyComplete()).toBe(true);
        expect(service.currentContent()).toBeNull();
      });

      it('should set hasNextContent to false on the last item', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();

        service.advanceToNext(); // game-2
        service.advanceToNext(); // game-3 (last)

        expect(service.hasNextContent()).toBe(false);
      });

      it('should return null when journey has not started', async () => {
        await service.loadHistory('test-history');
        // beginJourney() NOT called

        expect(service.advanceToNext()).toBeNull();
      });

      it('should return null when no history is loaded', () => {
        expect(service.advanceToNext()).toBeNull();
      });
    });

    // ── isJourneyComplete computed ─────────────────────────────────────────────

    describe('isJourneyComplete', () => {
      it('should be false before journey starts', async () => {
        await service.loadHistory('test-history');
        expect(service.isJourneyComplete()).toBe(false);
      });

      it('should be false while mid-journey', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();
        service.advanceToNext();

        expect(service.isJourneyComplete()).toBe(false);
      });

      it('should be false without a loaded history', () => {
        expect(service.isJourneyComplete()).toBe(false);
      });
    });

    // ── resetJourney() ─────────────────────────────────────────────────────────

    describe('resetJourney()', () => {
      it('should reset index and journey-started flag', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();
        service.advanceToNext();

        service.resetJourney();

        expect(service.getCurrentContentIndex()).toBe(0);
        expect(service.currentContent()).toBeNull(); // journey not started
      });
    });

    // ── getTotalContent() ──────────────────────────────────────────────────────

    describe('getTotalContent()', () => {
      it('should return the contentMap length after loading', async () => {
        await service.loadHistory('test-history');
        expect(service.getTotalContent()).toBe(3);
      });

      it('should return 0 when no history is loaded', () => {
        expect(service.getTotalContent()).toBe(0);
      });
    });

    // ── getInteractiveContentByType() ──────────────────────────────────────────

    describe('getInteractiveContentByType()', () => {
      it('should return content items matching the given gameType', async () => {
        await service.loadHistory('test-history');

        const result = service.getInteractiveContentByType('read-select');

        expect(result.length).toBe(1);
        expect(result[0].id).toBe('game-1');
      });

      it('should return an empty array when gameType is not present', async () => {
        await service.loadHistory('test-history');

        expect(service.getInteractiveContentByType('avatar')).toEqual([]);
      });

      it('should return an empty array when no history is loaded', () => {
        expect(service.getInteractiveContentByType('intruder')).toEqual([]);
      });
    });

    // ── cleanup() ─────────────────────────────────────────────────────────────

    describe('cleanup()', () => {
      it('should reset all internal state to defaults', async () => {
        await service.loadHistory('test-history');
        service.beginJourney();
        service.advanceToNext();

        service.cleanup();

        expect(service.histories()).toEqual([]);
        expect(service.activeHistory()).toBeNull();
        expect(service.currentContent()).toBeNull();
        expect(service.getCurrentContentIndex()).toBe(0);
        expect(service.isJourneyComplete()).toBe(false);
        expect(service.hasNextContent()).toBe(false);
      });
    });

    // ── Full journey flow ──────────────────────────────────────────────────────

    describe('full journey flow', () => {
      it('should traverse all games and detect completion', async () => {
        // 1. Load
        const loaded = await service.loadHistory('test-history');
        expect(loaded).toBe(true);
        expect(service.getTotalContent()).toBe(3);

        // 2. Begin
        const first = service.beginJourney();
        expect(first?.id).toBe('game-1');
        expect(service.isJourneyComplete()).toBe(false);
        expect(service.hasNextContent()).toBe(true);

        // 3. Game 2
        const second = service.advanceToNext();
        expect(second?.id).toBe('game-2');
        expect(service.getCurrentContentIndex()).toBe(1);
        expect(service.hasNextContent()).toBe(true);

        // 4. Game 3 (last)
        const third = service.advanceToNext();
        expect(third?.id).toBe('game-3');
        expect(service.getCurrentContentIndex()).toBe(2);
        expect(service.hasNextContent()).toBe(false);

        // 5. Past the end → journey complete
        const past = service.advanceToNext();
        expect(past).toBeNull();
        expect(service.isJourneyComplete()).toBe(true);
        expect(service.currentContent()).toBeNull();
      });
    });
  });

  // ── Without HistoryDataProvider (fallback mode) ───────────────────────────

  describe('without HistoryDataProvider (direct mock fallback)', () => {
    let service: HistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          HistoryService,
          // No HISTORY_DATA_PROVIDER provided → dataProvider will be null
        ],
      });
      service = TestBed.inject(HistoryService);
    });

    it('should load HISTORY_MOCK when the ID matches', async () => {
      const result = await service.loadHistory(HISTORY_MOCK.id);

      expect(result).toBe(true);
      expect(service.activeHistory()?.id).toBe(HISTORY_MOCK.id);
    });

    it('should return false when the ID does not match the mock', async () => {
      const result = await service.loadHistory('unknown-id');

      expect(result).toBe(false);
      expect(service.activeHistory()).toBeNull();
    });

    it('loadHistories() should return [HISTORY_MOCK] as fallback', async () => {
      const result = await service.loadHistories();

      expect(result.length).toBe(1);
      expect(result[0].id).toBe(HISTORY_MOCK.id);
      expect(service.histories().length).toBe(1);
    });

    it('should be able to start and advance through HISTORY_MOCK', async () => {
      await service.loadHistory(HISTORY_MOCK.id);
      const first = service.beginJourney();

      expect(first).not.toBeNull();
      expect(service.getTotalContent()).toBeGreaterThan(0);
    });
  });
});
