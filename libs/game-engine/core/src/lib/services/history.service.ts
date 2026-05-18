import { Injectable, computed, inject, signal } from '@angular/core';
import { History, InteractiveContent, GameType, SubjectCategory } from '../models/history.model';
import { HISTORY_DATA_PROVIDER, HistoryDataProvider, HistoryFilter } from './history-data-provider';
import { HISTORY_MOCK } from '../history-mock';

@Injectable()
export class HistoryService {
  // Inject the data provider if available, otherwise fallback to direct mock usage
  private readonly dataProvider = inject<HistoryDataProvider>(HISTORY_DATA_PROVIDER, { optional: true });

  private readonly historiesSignal = signal<History[]>([]);
  private readonly activeHistoryId = signal<string | null>(null);
  private readonly journeyStarted = signal(false);
  private readonly currentContentIndex = signal(0);

  readonly histories = this.historiesSignal.asReadonly();

  readonly activeHistory = computed<History | null>(() => {
    const id = this.activeHistoryId();
    if (!id) {
      return null;
    }
    return this.historiesSignal().find((history) => history.id === id) ?? null;
  });

  readonly currentContent = computed<InteractiveContent | null>(() => {
    if (!this.journeyStarted()) {
      return null;
    }
    const history = this.activeHistory();
    if (!history) {
      return null;
    }
    const index = this.currentContentIndex();
    return history.contentMap[index] ?? null;
  });

  readonly isJourneyComplete = computed<boolean>(() => {
    const history = this.activeHistory();
    if (!history || !this.journeyStarted()) {
      return false;
    }
    return this.currentContentIndex() >= history.contentMap.length;
  });

  readonly hasNextContent = computed<boolean>(() => {
    const history = this.activeHistory();
    if (!history || !this.journeyStarted()) {
      return false;
    }
    return this.currentContentIndex() < history.contentMap.length - 1;
  });

  /**
   * Load a history by ID.
   * Uses the injected HistoryDataProvider if available, otherwise falls back to the hardcoded mock.
   */
  async loadHistory(historyId: string): Promise<boolean> {
    let history: History | null = null;

    if (this.dataProvider) {
      // Use the provider (mock or backend)
      history = await this.dataProvider.getHistory(historyId);
    } else {
      // Direct fallback to the hardcoded mock (legacy behavior)
      history = historyId === HISTORY_MOCK.id ? HISTORY_MOCK : null;
    }

    if (!history) {
      console.warn(
        `History "${historyId}" not found. Falling back to mock history "${HISTORY_MOCK.id}".`
      );
      return false;
    }

    this.historiesSignal.set([history]);
    this.activeHistoryId.set(history.id);
    this.resetJourney();
    return true;
  }

  /**
   * Load all available histories, optionally filtered by category.
   * Used by category selector views.
   */
  async loadHistories(filter?: HistoryFilter): Promise<History[]> {
    if (this.dataProvider) {
      const histories = await this.dataProvider.getHistories(filter);
      this.historiesSignal.set(histories);
      return histories;
    }

    // Fallback: return the single mock
    const mockHistories = [HISTORY_MOCK];
    this.historiesSignal.set(mockHistories);
    return mockHistories;
  }

  /**
   * Get histories by category (convenience method for the category selector).
   */
  async getHistoriesByCategory(category: SubjectCategory): Promise<History[]> {
    return this.loadHistories({ category });
  }

  beginJourney(): InteractiveContent | null {
    if (!this.activeHistory()) {
      console.warn('No active history is loaded.');
      return null;
    }
    this.journeyStarted.set(true);
    this.currentContentIndex.set(0);
    return this.currentContent();
  }

  advanceToNext(): InteractiveContent | null {
    const history = this.activeHistory();
    if (!history || !this.journeyStarted()) {
      return null;
    }
    const nextIndex = this.currentContentIndex() + 1;
    if (nextIndex >= history.contentMap.length) {
      this.currentContentIndex.set(history.contentMap.length);
      return null;
    }
    this.currentContentIndex.set(nextIndex);
    return history.contentMap[nextIndex];
  }

  resetJourney(): void {
    this.journeyStarted.set(false);
    this.currentContentIndex.set(0);
  }

  getCurrentContentIndex(): number {
    return this.currentContentIndex();
  }

  getTotalContent(): number {
    const history = this.activeHistory();
    return history?.contentMap.length ?? 0;
  }

  getInteractiveContentByType(gameType: GameType): InteractiveContent[] {
    const history = this.activeHistory();
    if (!history) {
      return [];
    }
    return history.contentMap.filter((item) => item.gameType === gameType);
  }

  /**
   * Full cleanup of internal state.
   * Call this when navigating away from a completed journey
   * to prevent stale state from leaking into the next session.
   */
  cleanup(): void {
    this.journeyStarted.set(false);
    this.currentContentIndex.set(0);
    this.activeHistoryId.set(null);
    this.historiesSignal.set([]);
  }
}
