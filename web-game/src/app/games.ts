import { Type } from '@angular/core';
import { GameType } from './models/history.model';

export type GameComponentLoader = () => Promise<Type<unknown>>;

export const gameComponentRegistry: Record<GameType, GameComponentLoader> = {
  avatar: () =>
    import('./game-types/avatar-game/avatar-game.component').then(
      (m) => m.AvatarGameComponent
    ),
  'read-select': () =>
    import('./game-types/read-select-game/read-select-game.component').then(
      (m) => m.ReadSelectGameComponent
    ),
  'listen-type': () =>
    import('./game-types/listen-type-game/listen-type-game.component').then(
      (m) => m.ListenTypeGameComponent
    ),
  'fill-in-the-blanks': () =>
    import(
      './game-types/fill-in-the-blanks-game/fill-in-the-blanks-game.component'
    ).then((m) => m.FillInTheBlanksGameComponent),
  'read-aloud': () =>
    import('./game-types/read-aloud-game/read-aloud-game.component').then(
      (m) => m.ReadAloudGameComponent
    ),
  'speak-about-photo': () =>
    import(
      './game-types/speak-about-photo-game/speak-about-photo-game.component'
    ).then((m) => m.SpeakAboutPhotoGameComponent),
};

export function resolveGameLoader(
  gameType: GameType
): GameComponentLoader | null {
  return gameComponentRegistry[gameType] ?? null;
}
