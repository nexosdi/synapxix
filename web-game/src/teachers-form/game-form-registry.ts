// src/teachers-form/game-form-registry.ts
import { Type } from '@angular/core';

export const gameFormRegistry: Record<string, () => Promise<Type<any>>> = {
  'balance-master': () => 
    import('./edit-forms/balance-edit-form').then(m => m.BalanceFormComponent),
  'speak-about': () => 
    import('./edit-forms/speak-about-edit-form.component').then(m => m.SpeakPhotoFormComponent),
};