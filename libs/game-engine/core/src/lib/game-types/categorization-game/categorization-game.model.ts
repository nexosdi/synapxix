import { InteractiveContentBase } from '../../models/history.model';

export type CategorizationGameType = 'categorization';

export interface Category {
  id: string;
  label: string;
  icon?: string;
  colorClass?: string;
}

export interface SortableItem {
  id: string;
  text: string;
  imageUrl?: string;
  categoryId: string;
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