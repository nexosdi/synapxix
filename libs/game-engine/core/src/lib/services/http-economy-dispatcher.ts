import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EconomyDispatcher, EconomyClaimPayload } from './economy-dispatcher';


@Injectable({ providedIn: 'root' })
export class HttpEconomyDispatcher implements EconomyDispatcher {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/economy/claim-reward';

  async dispatch(payload: EconomyClaimPayload): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(this.endpoint, payload)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        console.warn(
          `[EconomyDispatcher] Session already claimed: ${payload.gameSessionId}`
        );
        return;
      }
      console.error('[EconomyDispatcher] Failed to dispatch reward:', error);
    }
  }
}