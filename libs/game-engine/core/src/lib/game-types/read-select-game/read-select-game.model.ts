import type { InteractiveContentBase } from '../../models/history.model';

export type ReadSelectGameType = 'read-select';

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
  ReadSelectGameType,
  ReadSelectGameData
>;

export type ReadSelectGameModel = ReadSelectGameData;

export function toReadSelectGameModel(
  content: ReadSelectInteractiveContent
): ReadSelectGameModel {
  return content.gameInput;
}
