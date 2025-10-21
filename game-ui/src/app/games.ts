import { Type } from '@angular/core';

/**
 * Registers all the games of the app
 */
export const games: Record<
  string,
  { code: string; componentLoader: () => Promise<Type<unknown>> }
> = {
  'level-1': {
    code: 'level-1',
    componentLoader: () =>
      import('./../games/level-1/level.component').then((m) => m.GameComponent),
  },
  'level-2': {
    code: 'level-2',
    componentLoader: () =>
      import('./../games/level-2/level.component').then((m) => m.GameComponent),
  },
};
