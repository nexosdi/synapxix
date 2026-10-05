import type { InteractiveContentBase } from '../../models/history.model';

export type ListenTypeGameType = 'listen-type';

export interface ListenTypeTolerance {
  caseInsensitive: boolean;
  allowedTypos: number;
  punctuationIgnored: boolean;
}

export interface ListenTypeGameData {
  audioUrl: string;
  answer: string;
  tolerance: ListenTypeTolerance;
  timeLimitSec: number;
  hint?: string;
  backgroundUrl?: string;
  characterMedia?: string;
  locale: string;
}

export type ListenTypeInteractiveContent = InteractiveContentBase<
  ListenTypeGameType,
  ListenTypeGameData
>;

export type ListenTypeGameModel = ListenTypeGameData;

export function toListenTypeGameModel(
  content: ListenTypeInteractiveContent
): ListenTypeGameModel {
  return content?.gameInput ?? {
    audioUrl: '',
    answer: '',
    tolerance: {
      caseInsensitive: true,
      allowedTypos: 0,
      punctuationIgnored: true,
    },
    timeLimitSec: 60,
    locale: 'es',
  };
}

/**
 * Calculates Levenshtein edit distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates whether user typed input matches the target answer according to the tolerance config.
 */
export function evaluateListenTypeAnswer(
  input: string,
  target: string,
  tolerance?: Partial<ListenTypeTolerance>
): boolean {
  const opts: ListenTypeTolerance = {
    caseInsensitive: tolerance?.caseInsensitive ?? true,
    allowedTypos: tolerance?.allowedTypos ?? 0,
    punctuationIgnored: tolerance?.punctuationIgnored ?? true,
  };

  let cleanInput = input?.trim() ?? '';
  let cleanTarget = target?.trim() ?? '';

  if (opts.punctuationIgnored) {
    const punctRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()?"'¡¿]/g;
    cleanInput = cleanInput.replace(punctRegex, '').replace(/\s+/g, ' ').trim();
    cleanTarget = cleanTarget.replace(punctRegex, '').replace(/\s+/g, ' ').trim();
  }

  if (opts.caseInsensitive) {
    cleanInput = cleanInput.toLowerCase();
    cleanTarget = cleanTarget.toLowerCase();
  }

  if (cleanInput === cleanTarget) {
    return true;
  }

  if (opts.allowedTypos > 0) {
    const distance = levenshteinDistance(cleanInput, cleanTarget);
    return distance <= opts.allowedTypos;
  }

  return false;
}

