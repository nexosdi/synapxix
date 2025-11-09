import type { InteractiveContentBase } from '../../models/history.model';

export type ListenTypeGameType = 'listen-type';

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
  ListenTypeGameType,
  ListenTypeGameData
>;

export type ListenTypeGameModel = ListenTypeGameData;

export function toListenTypeGameModel(
  content: ListenTypeInteractiveContent
): ListenTypeGameModel {
  return content.gameInput;
}
