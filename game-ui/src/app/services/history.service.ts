import { Injectable, computed, signal } from '@angular/core';
import {
  History,
  InteractiveContent,
  GameType,
} from '../models/history.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly historiesSignal = signal<History[]>([this.createDefaultHistory()]);
  private readonly activeHistoryName = signal<string | null>(
    this.historiesSignal()[0]?.name ?? null
  );

  readonly histories = this.historiesSignal.asReadonly();
  readonly activeHistory = computed<History | null>(() => {
    const name = this.activeHistoryName();
    return name
      ? this.historiesSignal().find((history) => history.name === name) ?? null
      : null;
  });

  selectHistory(name: string): void {
    if (this.historiesSignal().some((history) => history.name === name)) {
      this.activeHistoryName.set(name);
    }
  }

  upsertHistory(history: History): void {
    const histories = this.historiesSignal();
    const existingIndex = histories.findIndex(
      (item) => item.name === history.name
    );
    if (existingIndex >= 0) {
      histories.splice(existingIndex, 1, history);
    } else {
      histories.push(history);
    }
    this.historiesSignal.set([...histories]);
    this.activeHistoryName.set(history.name);
  }

  getInteractiveContentById(id: string): InteractiveContent | null {
    for (const history of this.historiesSignal()) {
      const content = history.contentMap.find((item) => item.id === id);
      if (content) {
        return content;
      }
    }
    return null;
  }

  getInteractiveContentByType(
    gameType: GameType
  ): InteractiveContent[] {
    return this.historiesSignal().flatMap((history) =>
      history.contentMap.filter((item) => item.gameType === gameType)
    );
  }

  private createDefaultHistory(): History {
    const contentMap: InteractiveContent[] = [
      {
        id: 'avatar-journey-1',
        gameType: 'avatar',
        gameData: {
          legend: 'Choose a guide to help you explore the language lab.',
          options: [
            {
              id: 'astro-mentor',
              label: 'Astro Mentor',
              description: 'Knows every word in the galaxy.',
              isCorrect: true,
            },
            {
              id: 'chef-linguini',
              label: 'Chef Linguini',
              description: 'Seasoned with stories, but not the right fit this time.',
              isCorrect: false,
            },
            {
              id: 'professor-parrot',
              label: 'Professor Parrot',
              description: 'Repeats everything you say!',
              isCorrect: false,
            },
          ],
          possibleAnswers: ['Astro Mentor'],
        },
      },
      {
        id: 'read-select-forest-1',
        gameType: 'read-select',
        gameData: {
          prompt: 'Tap every real word you can find before the vines grow back.',
          options: [
            { text: 'river', isReal: true },
            { text: 'glim', isReal: false },
            { text: 'bright', isReal: true },
            { text: 'snorf', isReal: false },
          ],
          minCorrectToPass: 2,
          timeLimitSec: 45,
          backgroundUrl: 'assets/backgrounds/forest.jpg',
          characterMedia: 'assets/characters/guide-fox.png',
          locale: 'en-US',
        },
      },
      {
        id: 'listen-type-bell-1',
        gameType: 'listen-type',
        gameData: {
          audioUrl: 'assets/audio/bell_chime.mp3',
          answer: 'Silver bells are ringing.',
          tolerance: {
            caseInsensitive: true,
            allowedTypos: 2,
            punctuationIgnored: true,
          },
          timeLimitSec: 60,
          hint: 'It starts with a color.',
          backgroundUrl: 'assets/backgrounds/bell-tower.jpg',
          characterMedia: 'assets/characters/owl-guide.png',
          locale: 'en-US',
        },
      },
      {
        id: 'fill-blanks-story-1',
        gameType: 'fill-in-the-blanks',
        gameData: {
          sentence: 'The ___ fox jumps over the ___ dog.',
          blanks: [
            {
              index: 0,
              choices: [
                { label: 'quick', isCorrect: true },
                { label: 'slow', isCorrect: false },
              ],
            },
            {
              index: 1,
              choices: [
                { label: 'lazy', isCorrect: true },
                { label: 'busy', isCorrect: false },
              ],
            },
          ],
          shuffleChoices: true,
          timeLimitSec: 40,
          media: 'assets/backgrounds/park.jpg',
          locale: 'en-US',
        },
      },
      {
        id: 'read-aloud-echo-1',
        gameType: 'read-aloud',
        gameData: {
          text: 'Practice makes progress, so read this line with confidence.',
          recording: {
            minDurationSec: 3,
            maxDurationSec: 15,
          },
          scoring: {
            minPronScore: 75,
            minCompleteness: 80,
          },
          media: 'assets/backgrounds/stage.jpg',
          locale: 'en-US',
        },
      },
      {
        id: 'speak-photo-garden-1',
        gameType: 'speak-about-photo',
        gameData: {
          imageUrl: 'assets/images/garden.jpg',
          prompt: 'Describe the garden in one or two sentences.',
          targetKeywords: ['flowers', 'sunlight', 'bench'],
          recording: {
            minDurationSec: 5,
            maxDurationSec: 20,
          },
          scoring: {
            keywordsRequired: 2,
            fluencyHint: 'Keep a steady pace and mention key details.',
          },
          media: 'assets/backgrounds/garden-frame.png',
          locale: 'en-US',
        },
      },
    ];

    return {
      name: 'Discovery Trail',
      description:
        'A guided journey through foundational literacy and speaking missions.',
      originalContent:
        'Follow the Discovery Trail to meet new guides, read vibrant prompts, and speak with confidence.',
      contentMap,
      path: contentMap.map((item) => item.id),
    };
  }
}
