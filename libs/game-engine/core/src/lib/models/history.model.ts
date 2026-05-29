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

/**
 * Subject categories for school curriculum.
 * Used to group histories by academic area.
 * The teammate's category selector views will filter by this field.
 */
export type SubjectCategory =
  | 'matematica'
  | 'lengua'
  | 'ingles'
  | 'musica'
  | 'ciencias'
  | 'historia'
  | 'arte'
  | 'tecnologia'
  | 'educacion-fisica'
  | 'general';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface History {
  id: string;
  name: string;
  description: string;
  originalContent: BaseContent;
  contentMap: InteractiveContent[];
  path: string[];

  // Category support for school subjects
  category?: SubjectCategory;
  difficulty?: DifficultyLevel;
  gradeLevel?: number;       // e.g. 1 = 1st grade, 6 = 6th grade
  tags?: string[];            // e.g. ['fracciones', 'suma'] for fine-grained filtering
  thumbnailUrl?: string;      // For the category selector card UI
}
