import type { InteractiveContentBase } from '../../models/history.model';

export type AvatarGameType = 'avatar';

export interface AvatarGameOption {
  id: string;
  label: string;
  description?: string;
  isCorrect: boolean;
}

export interface AvatarGameData {
  legend: string;
  options: AvatarGameOption[];
  possibleAnswers: string[];
}

export type AvatarInteractiveContent = InteractiveContentBase<
  AvatarGameType,
  AvatarGameData
>;

export type AvatarGameModel = AvatarGameData;

export function toAvatarGameModel(
  content: AvatarInteractiveContent
): AvatarGameModel {
  return content.gameInput;
}
