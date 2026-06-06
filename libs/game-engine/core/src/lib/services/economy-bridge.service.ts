import { inject, Injectable } from '@angular/core';
import { AnyGameResult } from '../models/game-result.model';
import { GameType } from '../models/history.model';
import { ECONOMY_DISPATCHER, EconomyClaimPayload } from './economy-dispatcher';
import { HttpEconomyDispatcher } from './http-economy-dispatcher';


const NON_REWARDED_GAME_TYPES = new Set<GameType>(['avatar']);

@Injectable({ providedIn: 'root' })
export class EconomyBridgeService {
  private readonly dispatcher = inject(ECONOMY_DISPATCHER, { optional: true })
    ?? new HttpEconomyDispatcher();
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