import { InteractiveContentBase } from '../../models/history.model';

export type MemoryGameType = 'neural-link';

export interface MemoryCard {
  id: string;      // ID único de la carta
  matchId: string; // ID compartido con su pareja
  text?: string;
  imageUrl?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface MemoryGameData {
  prompt: string;
  cards: Omit<MemoryCard, 'isFlipped' | 'isMatched'>[];
  locale: string;
}

export type MemoryInteractiveContent = InteractiveContentBase<
  MemoryGameType,
  MemoryGameData
>;

export function toMemoryGameModel(content: MemoryInteractiveContent): MemoryGameData {
  return content.gameInput;
}