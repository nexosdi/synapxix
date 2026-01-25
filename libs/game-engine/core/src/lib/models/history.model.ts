export type GameType =
  | 'avatar'
  | 'read-select'
  | 'listen-type'
  | 'fill-in-the-blanks'
  | 'read-aloud'
  | 'timeline-order'
  | 'categorization'
  | 'spotlight'
  | 'neural-link'
  | 'intruder'
  | 'balance-master'
  | 'sound-match'
  | 'speak-about-photo';

// Definimos las categorías posibles para evitar errores de escritura
export type GameCategory = 'literatura' | 'historia' | 'ciencias' | 'general';

export interface InteractiveContentBase<
  TType extends GameType = GameType,
  TData extends object = object
> {
  id: string;
  gameType: TType;
  gameInput: TData;
  // --- NUEVOS CAMPOS DINÁMICOS ---
  category?: GameCategory; // Para filtrar en las pantallas
  title?: string;          // Nombre amigable para la lista
  order?: number;         // Orden dentro de su categoría
}

export type InteractiveContent<
  TType extends GameType = GameType,
  TData extends object = object
> = InteractiveContentBase<TType, TData>;

export interface BaseContent<
  TContentType extends string = string,
  TContent extends object = object
> {
  id: string;
  type: TContentType;
  content: TContent;
}

export interface History {
  id: string;
  name: string;
  description: string;
  originalContent: BaseContent;
  contentMap: InteractiveContent[];
  path: string[];
}