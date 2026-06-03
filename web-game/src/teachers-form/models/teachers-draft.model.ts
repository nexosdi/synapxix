// src/teachers-forms/models/teacher-draft.model.ts
import { GameType } from '@nexosdi.synapxix/game-engine/core';

/** Represents the loosely-typed input data for any game type during draft/editing.
 * Each game type owns its own shape — we use Record here to allow any key while
 * still being safer than `any`. Narrow further per game type when implementing forms.
 */
export type GameInputDraft = { prompt?: string; [key: string]: unknown };

export interface GameDraft {
  tempId: string;
  gameType: GameType;
  label: string;
  gameInput: GameInputDraft;
}