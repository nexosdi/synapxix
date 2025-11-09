import { History, InteractiveContent } from './models/history.model';

// Remarks: this file contains a example history, this must come from a server, only for development purposes.
export const contentMap: InteractiveContent[] = [
  {
    id: 'avatar-journey-1',
    gameType: 'avatar',
    gameInput: {
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
          description:
            'Seasoned with stories, but not the right fit this time.',
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
    gameInput: {
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
    gameInput: {
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
    gameInput: {
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
    gameInput: {
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
    gameInput: {
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

export const HISTORY_MOCK: History = {
  name: 'Discovery Trail',
  description:
    'A guided journey through foundational literacy and speaking missions.',
  originalContent: {
    id: '123',
    type: 'text',
    content: {
      text: 'Follow the Discovery Trail to meet new guides, read vibrant prompts, and speak with confidence.',
      title: 'Onboard',
    },
  },
  contentMap,
  path: contentMap.map((item) => item.id),
  id: 'onboarding',
};
