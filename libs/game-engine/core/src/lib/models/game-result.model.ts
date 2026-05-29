import { GameType } from './history.model';

export interface GameResult<TGameType extends GameType, TAnswer = any, TFeedback = any> {
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
export type AvatarResult = GameResult<'avatar', any>;

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
export type BalanceMasterResult = GameResult<'balance-master', { balancedItems: Record<string, any> }>;

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
