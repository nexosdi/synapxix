import { Injectable, computed, signal } from '@angular/core';
import { HISTORY_MOCK } from '../history-mock';
import {
  GameType,
  History,
  InteractiveContent,
} from '../models/history.model';

@Injectable()
export class HistoryService {
  private readonly historyRegistry = new Map<string, History>([
    [HISTORY_MOCK.id, HISTORY_MOCK],
  ]);
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

  loadHistory(historyId: string): boolean {
    const history = this.historyRegistry.get(historyId);
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

  getInteractiveContentByType(
    gameType: GameType
  ): InteractiveContent[] {
    const history = this.activeHistory();
    if (!history) {
      return [];
    }
    return history.contentMap.filter((item) => item.gameType === gameType);
  }
}
