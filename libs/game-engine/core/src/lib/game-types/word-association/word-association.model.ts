import { InteractiveContentBase } from '../../models/history.model';

export type WordAssociationGameType = 'word-association';

export interface WordAssociationOption {
  id: string;
  word: string;
  isRelated: boolean;
}

export interface WordAssociationGameData {
  prompt: string;         // e.g., "Select the words related to"
  baseWord: string;       // e.g., "OCEAN"
  options: WordAssociationOption[];
  timeLimitSec?: number;
  locale: string;
}

export type WordAssociationInteractiveContent = InteractiveContentBase<
  WordAssociationGameType,
  WordAssociationGameData
>;

export function toWordAssociationModel(content: WordAssociationInteractiveContent): WordAssociationGameData {
  return content.gameInput;
}
