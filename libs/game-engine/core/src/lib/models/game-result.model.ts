import { GameType } from './history.model';

export interface GameResult<TGameType extends GameType, TAnswer = unknown, TFeedback = unknown> {
  gameType: TGameType;
  answer: TAnswer;
  isCorrect: boolean;
  score: number;
  timeSpentMs: number;
  feedback?: TFeedback;
}

// Read & Select
export interface ReadSelectAnswer {
  selectedOptionId: string;
}
export type ReadSelectResult = GameResult<'read-select', ReadSelectAnswer>;

// Fill in the Blanks
export interface FillBlanksAnswer {
  blanks: Record<string, string>; // blankId -> value
}
export type FillBlanksResult = GameResult<'fill-in-the-blanks', FillBlanksAnswer>;

// Intruder
export interface IntruderAnswer {
  selectedItemId: string;
}
export type IntruderResult = GameResult<'intruder', IntruderAnswer>;

// Avatar
export type AvatarResult = GameResult<'avatar', unknown>;

// Listen & Type
export type ListenTypeResult = GameResult<'listen-type', { typedText: string }>;

// Read Aloud
export type ReadAloudResult = GameResult<'read-aloud', { audioUrl?: string; recognizedText: string }>;

// Timeline Order
export type TimelineOrderResult = GameResult<'timeline-order', { orderedItemIds: string[] }>;

// Categorization
export type CategorizationResult = GameResult<'categorization', { categoryMapping: Record<string, string> }>; // itemId -> categoryId

// Spotlight
export type SpotlightResult = GameResult<'spotlight', { selectedAreas: string[] }>;

// Neural Link
export type NeuralLinkResult = GameResult<'neural-link', { connections: Array<{ fromId: string; toId: string }> }>;

// Balance Master
export type BalanceMasterResult = GameResult<'balance-master', { balancedItems: Record<string, unknown> }>;

// Sound Match
export type SoundMatchResult = GameResult<'sound-match', { matchedPairs: Array<{ soundId: string; optionId: string }> }>;

// Speak About Photo
export type SpeakAboutPhotoResult = GameResult<'speak-about-photo', { audioUrl?: string; recognizedText: string }>;

export type AnyGameResult =
  | ReadSelectResult
  | FillBlanksResult
  | IntruderResult
  | AvatarResult
  | ListenTypeResult
  | ReadAloudResult
  | TimelineOrderResult
  | CategorizationResult
  | SpotlightResult
  | NeuralLinkResult
  | BalanceMasterResult
  | SoundMatchResult
  | SpeakAboutPhotoResult;

// ── Factories ────────────────────────────────────────────

/**
 * Generic factory to create a GameResult with sensible defaults and optional overrides.
 */
export function createGameResult<TGameType extends GameType, TAnswer = unknown, TFeedback = unknown>(
  gameType: TGameType,
  overrides?: Partial<GameResult<TGameType, TAnswer, TFeedback>>
): GameResult<TGameType, TAnswer, TFeedback> {
  return {
    gameType,
    answer: {} as TAnswer,
    isCorrect: true,
    score: 100,
    timeSpentMs: 1500,
    ...overrides,
  };
}

export function createReadSelectResult(overrides?: Partial<ReadSelectResult>): ReadSelectResult {
  return {
    gameType: 'read-select',
    answer: { selectedOptionId: 'opt-1' },
    isCorrect: true,
    score: 100,
    timeSpentMs: 1200,
    ...overrides,
  };
}

export function createFillBlanksResult(overrides?: Partial<FillBlanksResult>): FillBlanksResult {
  return {
    gameType: 'fill-in-the-blanks',
    answer: { blanks: { 'blank-1': 'word' } },
    isCorrect: true,
    score: 100,
    timeSpentMs: 2000,
    ...overrides,
  };
}

export function createIntruderResult(overrides?: Partial<IntruderResult>): IntruderResult {
  return {
    gameType: 'intruder',
    answer: { selectedItemId: 'item-intruder' },
    isCorrect: true,
    score: 100,
    timeSpentMs: 1500,
    ...overrides,
  };
}

export function createAvatarResult(overrides?: Partial<AvatarResult>): AvatarResult {
  return {
    gameType: 'avatar',
    answer: { completed: true },
    isCorrect: true,
    score: 100,
    timeSpentMs: 1000,
    ...overrides,
  };
}

export function createListenTypeResult(overrides?: Partial<ListenTypeResult>): ListenTypeResult {
  return {
    gameType: 'listen-type',
    answer: { typedText: 'sample text' },
    isCorrect: true,
    score: 100,
    timeSpentMs: 3000,
    ...overrides,
  };
}

export function createReadAloudResult(overrides?: Partial<ReadAloudResult>): ReadAloudResult {
  return {
    gameType: 'read-aloud',
    answer: { audioUrl: 'https://example.com/audio.mp3', recognizedText: 'sample audio text' },
    isCorrect: true,
    score: 100,
    timeSpentMs: 4000,
    ...overrides,
  };
}

export function createTimelineOrderResult(overrides?: Partial<TimelineOrderResult>): TimelineOrderResult {
  return {
    gameType: 'timeline-order',
    answer: { orderedItemIds: ['item-1', 'item-2', 'item-3'] },
    isCorrect: true,
    score: 100,
    timeSpentMs: 2500,
    ...overrides,
  };
}

export function createCategorizationResult(overrides?: Partial<CategorizationResult>): CategorizationResult {
  return {
    gameType: 'categorization',
    answer: { categoryMapping: { 'item-1': 'cat-1', 'item-2': 'cat-2' } },
    isCorrect: true,
    score: 100,
    timeSpentMs: 3500,
    ...overrides,
  };
}

export function createSpotlightResult(overrides?: Partial<SpotlightResult>): SpotlightResult {
  return {
    gameType: 'spotlight',
    answer: { selectedAreas: ['area-1', 'area-2'] },
    isCorrect: true,
    score: 100,
    timeSpentMs: 1800,
    ...overrides,
  };
}

export function createNeuralLinkResult(overrides?: Partial<NeuralLinkResult>): NeuralLinkResult {
  return {
    gameType: 'neural-link',
    answer: { connections: [{ fromId: 'node-1', toId: 'node-2' }] },
    isCorrect: true,
    score: 100,
    timeSpentMs: 2200,
    ...overrides,
  };
}

export function createBalanceMasterResult(overrides?: Partial<BalanceMasterResult>): BalanceMasterResult {
  return {
    gameType: 'balance-master',
    answer: { balancedItems: { left: 10, right: 10 } },
    isCorrect: true,
    score: 100,
    timeSpentMs: 2800,
    ...overrides,
  };
}

export function createSoundMatchResult(overrides?: Partial<SoundMatchResult>): SoundMatchResult {
  return {
    gameType: 'sound-match',
    answer: { matchedPairs: [{ soundId: 'snd-1', optionId: 'opt-1' }] },
    isCorrect: true,
    score: 100,
    timeSpentMs: 2400,
    ...overrides,
  };
}

export function createSpeakAboutPhotoResult(overrides?: Partial<SpeakAboutPhotoResult>): SpeakAboutPhotoResult {
  return {
    gameType: 'speak-about-photo',
    answer: { audioUrl: 'https://example.com/photo-desc.mp3', recognizedText: 'description of photo' },
    isCorrect: true,
    score: 100,
    timeSpentMs: 3800,
    ...overrides,
  };
}

