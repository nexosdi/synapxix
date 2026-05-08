// libs/game-engine/core/src/lib/game-types/categorization-game/categorization-game.model.ts

import { InteractiveContentBase } from '../../models/history.model';

export type CategorizationGameType = 'categorization';

export interface Category {
  id: string;
  label: string;
  icon?: string;
  colorClass?: string; // Para personalizar el color de la caja
}

export interface SortableItem {
  id: string;
  text: string;
  imageUrl?: string;
  categoryId: string; // El ID de la categoría a la que pertenece
}

export interface CategorizationGameData {
  prompt: string;
  categories: Category[];
  items: SortableItem[];
  locale: string;
}

export type CategorizationInteractiveContent = InteractiveContentBase<
  CategorizationGameType,
  CategorizationGameData
>;

export function toCategorizationGameModel(
  content: CategorizationInteractiveContent
): CategorizationGameData {
  return content.gameInput;
}