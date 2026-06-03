import { InjectionToken } from '@angular/core';

export interface EconomyClaimPayload {
  readonly gameSessionId: string;
  readonly score: number;
  readonly victory: boolean;
}

export interface EconomyDispatcher {
  dispatch(payload: EconomyClaimPayload): Promise<void>;
}

export const ECONOMY_DISPATCHER = new InjectionToken<EconomyDispatcher>(
  'ECONOMY_DISPATCHER'
);