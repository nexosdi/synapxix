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

export interface InteractiveContentBase<
  TType extends GameType = GameType,
  TData extends object = object
> {
  id: string;
  gameType: TType;
  gameInput: TData;
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
