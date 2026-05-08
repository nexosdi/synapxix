import { InteractiveContentBase } from '../../models/history.model';

export type SpeakAboutPhotoGameType = 'speak-about-photo';

export interface SpeakAboutPhotoScoringConfig {
  keywordsRequired: number;
  fluencyHint?: string;
}

export interface SpeakAboutPhotoRecordingConfig {
  minDurationSec: number;
  maxDurationSec: number;
}

export interface SpeakAboutPhotoGameData {
  imageUrl: string;
  prompt: string;
  targetKeywords: string[];
  recording: SpeakAboutPhotoRecordingConfig;
  scoring: SpeakAboutPhotoScoringConfig;
  media?: string;
  locale: string;
}

// ESTA ES LA EXPORTACIÓN QUE FALTA (TS2305)
export type SpeakAboutPhotoInteractiveContent = InteractiveContentBase<
  SpeakAboutPhotoGameType,
  SpeakAboutPhotoGameData
>;

export type SpeakAboutPhotoGameModel = SpeakAboutPhotoGameData;

// ESTA ES LA FUNCIÓN QUE FALTA (TS2305)
export function toSpeakAboutPhotoGameModel(
  content: SpeakAboutPhotoInteractiveContent
): SpeakAboutPhotoGameModel {
  return content.gameInput;
}