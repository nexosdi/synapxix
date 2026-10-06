import { InteractiveContentBase } from '../../models/history.model';

export type SpotlightGameType = 'spotlight';

export interface HiddenTarget {
  id: string;
  name: string;
  x: number; // Porcentaje de 0 a 100
  y: number; // Porcentaje de 0 a 100
  found: boolean;
}

export interface SpotlightGameData {
  prompt: string;
  backgroundImage: string; // La escena principal
  targets: HiddenTarget[];
  locale: string;
}

export type SpotlightInteractiveContent = InteractiveContentBase<
  SpotlightGameType,
  SpotlightGameData
>;

export function toSpotlightGameModel(
  content: SpotlightInteractiveContent
): SpotlightGameData {
  if (!content || !content.gameInput) {
    throw new Error('SpotlightInteractiveContent: gameInput is missing');
  }
  return content.gameInput;
}