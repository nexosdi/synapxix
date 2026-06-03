// src/teachers-forms/models/game-form.model.ts
import { EventEmitter } from '@angular/core';

export interface IGameConfigForm<T = Record<string, unknown>> {
  data: T;
  dataChange: EventEmitter<T>;
}