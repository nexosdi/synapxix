import { History, InteractiveContent } from './models/history.model';

// Remarks: this file contains a example history, this must come from a server, only for development purposes.
export const contentMap: InteractiveContent[] = [
  {
    "id": "odd-01",
    "gameType": "intruder",
    "gameInput": {
      "prompt": "¿Quién no vive en la selva?",
      "locale": "es-AR",
      "options": [
        { "id": "1", "text": "León", "isCorrect": false, "imageUrl": "..." },
        { "id": "2", "text": "Tigre", "isCorrect": false, "imageUrl": "..." },
        { "id": "3", "text": "Pájaro", "isCorrect": false, "imageUrl": "..." },
        { "id": "4", "text": "Pingüino", "isCorrect": true, "imageUrl": "..." }
      ]
    }
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
    "id": "mission-sound-001",
    "gameType": "sound-match",
    "gameInput": {
      "prompt": "¿Qué instrumento suena así?",
      "audioUrl": "assets/audio/piano-sample.mp3",
      "locale": "es-AR",
      "options": [
        { 
          "id": "opt-1", 
          "text": "Piano", 
          "isCorrect": true, 
          "imageUrl": "assets/images/games/piano.png" 
        },
        { 
          "id": "opt-2", 
          "text": "Guitarra", 
          "isCorrect": false, 
          "imageUrl": "assets/images/games/guitar.png" 
        },
        { 
          "id": "opt-3", 
          "text": "Tambor", 
          "isCorrect": false, 
          "imageUrl": "assets/images/games/drum.png" 
        }
      ]
    }
  },
  {
    "id": "balance-01",
    "gameType": "balance-master",
    "gameInput": {
      "prompt": "¿Qué número es más grande?",
      "locale": "es-AR",
      "leftSide": {
        "value": 5,
        "label": "Unidades"
      },
      "rightSide": {
        "value": 10,
        "label": "Decenas"
      },
      "correctOperator": "<"
    }
  },
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
    id: 'speak-photo-pixel-1',
    gameType: 'speak-about-photo',
    gameInput: {
      imageUrl: 'logo-pixelart2.png',
      prompt: 'Describe what you see in this pixel art image.',
      targetKeywords: ['pixel', 'art', 'logo', 'game'],
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
  {
    id: 'h-arg-01',
    gameType: 'timeline-order',
    gameInput: {
      prompt: '¿Puedes ordenar estos hechos históricos?',
    locale: 'es-AR',
    events: [
      { id: 'e1', text: 'Revolución de Mayo', order: 1 },
      { id: 'e2', text: 'Declaración de la Independencia', order: 2 },
      { id: 'e3', text: 'Cruce de los Andes', order: 3 },
      { id: 'e4', text: 'Constitución Nacional', order: 4 }
    ]
  }
},
    {
    id: 'time-line-order-1',
    gameType: 'categorization',
    gameInput: {
      prompt: '¿Cuáles son Frutas y cuáles Vegetales?',
      locale: 'es-AR',
      categories: [
        { id: 'cat1', label: 'Frutas', icon: '🍎' },
        { id: 'cat2', label: 'Vegetales', icon: '🥦' }
      ],
      items: [
        { id: 'i1', text: 'Manzana', categoryId: 'cat1', imageUrl: 'URL_AQUÍ' },
        { id: 'i2', text: 'Zanahoria', categoryId: 'cat2', imageUrl: 'URL_AQUÍ' },
        { id: 'i3', text: 'Banana', categoryId: 'cat1' },
        { id: 'i4', text: 'Lechuga', categoryId: 'cat2' }
      ]
    }
  
  },
  {
  "id": "mem-01",
  "gameType": "neural-link",
  "gameInput": {
    "prompt": "Encuentra las parejas de animales",
    "locale": "es-AR",
    "cards": [
      { "id": "1", "matchId": "a", "text": "León" },
      { "id": "2", "matchId": "a", "imageUrl": "URL_LEON" },
      { "id": "3", "matchId": "b", "text": "Mono" },
      { "id": "4", "matchId": "b", "imageUrl": "URL_MONO" }
    ]
  }
},
{
  "id": "mission-spotlight-01",
  "gameType": "spotlight",
  "gameInput": {
    "prompt": "Protocolo de Seguridad: Localiza las anomalías térmicas en el reactor central",
    "backgroundImage": "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=2000",
    "locale": "es-AR",
    "targets": [
      { 
        "id": "anomaly-1", 
        "name": "Núcleo de Fusión", 
        "x": 49.5, 
        "y": 51.2, 
        "found": false 
      },
      { 
        "id": "anomaly-2", 
        "name": "Ventilación Primaria", 
        "x": 22.8, 
        "y": 35.4, 
        "found": false 
      },
      { 
        "id": "anomaly-3", 
        "name": "Tanque de Refrigerante", 
        "x": 82.1, 
        "y": 72.8, 
        "found": false 
      }
    ]
  }
}
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
  category: 'general',
  difficulty: 'beginner',
  gradeLevel: 1,
  tags: ['onboarding', 'introduction', 'mixed'],
};
