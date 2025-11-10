import type { InteractiveContentBase } from '../../models/history.model';

export type ReadAloudGameType = 'read-aloud';

export interface ReadAloudRecordingConfig {
  minDurationSec: number;
  maxDurationSec: number;
}

export interface ReadAloudScoringConfig {
  minPronScore: number;
  minCompleteness: number;
}

export interface ReadAloudGameData {
  text: string;
  recording: ReadAloudRecordingConfig;
  scoring: ReadAloudScoringConfig;
  media?: string;
  locale: string;
}

export type ReadAloudInteractiveContent = InteractiveContentBase<
  ReadAloudGameType,
  ReadAloudGameData
>;

export type ReadAloudGameModel = ReadAloudGameData;

export function toReadAloudGameModel(
  content: ReadAloudInteractiveContent
): ReadAloudGameModel {
  return content.gameInput;
}
