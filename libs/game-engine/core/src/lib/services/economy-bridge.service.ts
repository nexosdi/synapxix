import { inject, Injectable } from '@angular/core';
import { AnyGameResult } from '../models/game-result.model';
import { GameType } from '../models/history.model';
import { ECONOMY_DISPATCHER, EconomyClaimPayload, EconomyDispatcher } from './economy-dispatcher';
import { HttpEconomyDispatcher } from './http-economy-dispatcher';

const NON_REWARDED_GAME_TYPES = new Set<GameType>(['avatar']);

/**
 * Bridges game results to the economy system.
 *
 * Uses ECONOMY_DISPATCHER if provided (allows testing and swapping implementations).
 * Falls back to HttpEconomyDispatcher when the token is not provided at the module level.
 *
 * NOTE: The fallback uses `inject(HttpEconomyDispatcher)` so Angular manages the instance
 * correctly within the injector, instead of `new HttpEconomyDispatcher()` which would
 * bypass DI and break testability.
 */
@Injectable({ providedIn: 'root' })
export class EconomyBridgeService {
  private readonly dispatcher = inject(ECONOMY_DISPATCHER, { optional: true })
    ?? inject(HttpEconomyDispatcher);

  processGameResult(sessionId: string, result: AnyGameResult): void {
    if (NON_REWARDED_GAME_TYPES.has(result.gameType)) return;

    const payload: EconomyClaimPayload = {
      gameSessionId: sessionId,
      score: result.score,
      victory: result.isCorrect,
    };

    this.dispatcher.dispatch(payload);
  }
}