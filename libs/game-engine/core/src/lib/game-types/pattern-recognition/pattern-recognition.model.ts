import { InteractiveContentBase } from '../../models/history.model';

export type PatternRecognitionGameType = 'pattern-recognition';

export interface PatternRecognitionOption {
  id: string;
  content: string; // emoji, text, or image URL
  isCorrect: boolean;
}

export interface PatternRecognitionGameData {
  prompt: string;            // e.g., "¿Qué elemento sigue en el patrón?"
  sequence: string[];        // Items of the pattern. Use '?' for the missing spot.
  options: PatternRecognitionOption[];
  timeLimitSec?: number;
  locale: string;
}

export type PatternRecognitionInteractiveContent = InteractiveContentBase<
  PatternRecognitionGameType,
  PatternRecognitionGameData
>;

export function toPatternRecognitionModel(
  content: PatternRecognitionInteractiveContent,
): PatternRecognitionGameData {
  return content.gameInput;
}
