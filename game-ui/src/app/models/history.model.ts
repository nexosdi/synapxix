export type GameType =
  | 'avatar'
  | 'read-select'
  | 'listen-type'
  | 'fill-in-the-blanks'
  | 'read-aloud'
  | 'speak-about-photo';

export interface InteractiveContentBase<
  TType extends GameType,
  TData extends object,
> {
  id: string;
  gameType: TType;
  gameData: TData;
}

export interface AvatarGameOption {
  id: string;
  label: string;
  description?: string;
  isCorrect: boolean;
}

export interface AvatarGameData {
  legend: string;
  options: AvatarGameOption[];
  possibleAnswers: string[];
}

export type AvatarInteractiveContent = InteractiveContentBase<
  'avatar',
  AvatarGameData
>;

export interface ReadSelectOption {
  text: string;
  isReal: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReadSelectGameData {
  prompt: string;
  options: ReadSelectOption[];
  minCorrectToPass: number;
  timeLimitSec: number;
  backgroundUrl?: string;
  characterMedia?: string;
  locale: string;
}

export type ReadSelectInteractiveContent = InteractiveContentBase<
  'read-select',
  ReadSelectGameData
>;

export interface ListenTypeTolerance {
  caseInsensitive: boolean;
  allowedTypos: number;
  punctuationIgnored: boolean;
}

export interface ListenTypeGameData {
  audioUrl: string;
  answer: string;
  tolerance: ListenTypeTolerance;
  timeLimitSec: number;
  hint?: string;
  backgroundUrl?: string;
  characterMedia?: string;
  locale: string;
}

export type ListenTypeInteractiveContent = InteractiveContentBase<
  'listen-type',
  ListenTypeGameData
>;

export interface FillInTheBlankChoice {
  label: string;
  isCorrect: boolean;
}

export interface FillInTheBlank {
  index: number;
  choices: FillInTheBlankChoice[];
}

export interface FillInTheBlanksGameData {
  sentence: string;
  blanks: FillInTheBlank[];
  shuffleChoices: boolean;
  timeLimitSec?: number;
  media?: string;
  locale: string;
}

export type FillInTheBlanksInteractiveContent = InteractiveContentBase<
  'fill-in-the-blanks',
  FillInTheBlanksGameData
>;

export interface ReadAloudRecordingConfig {
  minDurationSec: number;
  maxDurationSec: number;
}

export interface ReadAloudScoringConfig {
  minPronScore: number;
  minCompleteness: number;
}

export interface ReadAloudGameData {
  text: string;
  recording: ReadAloudRecordingConfig;
  scoring: ReadAloudScoringConfig;
  media?: string;
  locale: string;
}

export type ReadAloudInteractiveContent = InteractiveContentBase<
  'read-aloud',
  ReadAloudGameData
>;

export interface SpeakAboutPhotoScoringConfig {
  keywordsRequired: number;
  fluencyHint?: string;
}

export interface SpeakAboutPhotoRecordingConfig {
  minDurationSec: number;
  maxDurationSec: number;
}

export interface SpeakAboutPhotoGameData {
  imageUrl: string;
  prompt: string;
  targetKeywords: string[];
  recording: SpeakAboutPhotoRecordingConfig;
  scoring: SpeakAboutPhotoScoringConfig;
  media?: string;
  locale: string;
}

export type SpeakAboutPhotoInteractiveContent = InteractiveContentBase<
  'speak-about-photo',
  SpeakAboutPhotoGameData
>;

export type InteractiveContent =
  | AvatarInteractiveContent
  | ReadSelectInteractiveContent
  | ListenTypeInteractiveContent
  | FillInTheBlanksInteractiveContent
  | ReadAloudInteractiveContent
  | SpeakAboutPhotoInteractiveContent;

export interface History {
  name: string;
  description: string;
  originalContent: string;
  contentMap: InteractiveContent[];
  path: string[];
}
