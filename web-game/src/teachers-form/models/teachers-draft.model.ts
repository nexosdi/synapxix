// src/teachers-forms/models/teacher-draft.model.ts
import { GameType, InteractiveContent } from '@nexosdi.synapxix/game-engine/core';

export interface GameDraft {
  tempId: string;
  gameType: GameType;
  label: string;
  gameInput: any; // Se llenará según el tipo
}