import type { InteractiveContentBase } from '../../models/history.model';

export type FillInTheBlanksGameType = 'fill-in-the-blanks';

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
  FillInTheBlanksGameType,
  FillInTheBlanksGameData
>;

export type FillInTheBlanksGameModel = FillInTheBlanksGameData;

export function toFillInTheBlanksGameModel(
  content: FillInTheBlanksInteractiveContent
): FillInTheBlanksGameModel {
  return content.gameInput;
}
