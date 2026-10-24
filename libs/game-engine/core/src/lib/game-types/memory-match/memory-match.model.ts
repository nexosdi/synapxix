import { InteractiveContentBase } from '../../models/history.model';

export type MemoryMatchGameType = 'memory-match';

export interface MemoryMatchCard {
  id: string;        // unique card id (e.g. 'card-1a', 'card-1b')
  pairId: string;    // shared pair id (e.g. 'pair-1')
  label: string;     // text to display
  imageUrl?: string; // optional image
}

export interface MemoryMatchGameData {
  prompt: string;
  cards: MemoryMatchCard[];       // pre-shuffled, includes both copies
  columns: number;                // grid layout hint (e.g. 4)
  timeLimitSec?: number;          // optional countdown
  locale: string;
}

export type MemoryMatchInteractiveContent = InteractiveContentBase<
  MemoryMatchGameType,
  MemoryMatchGameData
>;

export function toMemoryMatchModel(content: MemoryMatchInteractiveContent): MemoryMatchGameData {
  return content.gameInput;
}
