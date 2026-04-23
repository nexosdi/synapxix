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
  'categorization': () =>
    import(
      './game-types/categorization-game/categorization-game.component'
    ).then((m) => m.CategorizationGameComponent),
  'spotlight': () =>
    import(
      './game-types/spotlight-game/spotlight-game.component'
    ).then((m) => m.SpotlightGameComponent),
  'neural-link': () =>
    import(
      './game-types/neural-link-game/neural-link-game.component'
    ).then((m) => m.NeuralLinkGameComponent),
  'timeline-order': () =>
    import(
      './game-types/timeline-order-game/timeline-order-game.component'
    ).then((m) => m.TimelineOrderGameComponent),
  'intruder': () =>
    import(
      './game-types/intruder-game/intruder-game.component' // <-- Corregido aquí
    ).then((m) => m.IntruderGameComponent),
  'balance-master': () =>
    import(
      './game-types/balance-game/balance-game.component' // <-- Corregido aquí
    ).then((m) => m.BalanceMasterComponent),
  'sound-match': () =>
    import(
      './game-types/sound-match/sound-match.component' // <-- Corregido aquí
    ).then((m) => m.SoundMatchGameComponent),
};

export function resolveGameLoader(
  gameType: GameType
): GameComponentLoader | null {
  return gameComponentRegistry[gameType] ?? null;
}
