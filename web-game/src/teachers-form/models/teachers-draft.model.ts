// src/teachers-forms/models/teacher-draft.model.ts
import { GameType, InteractiveContent } from '../../../../libs/game-engine/core/src/lib/models/history.model';

export interface GameDraft {
  tempId: string;
  gameType: GameType;
  label: string;
  gameInput: any; // Se llenará según el tipo
}