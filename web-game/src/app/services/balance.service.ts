import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class BalanceService {
  private _cognitas = signal<number>(0);
  cognitas = this._cognitas.asReadonly();

  private _lastReward = signal<{msg: string; amount: number} | null>(null);
  lastReward = this._lastReward.asReadonly();

  updateBalance(amount: number, message?: string) {
    this._cognitas.update(current => current + amount);

    if (message) {
      this._lastReward.set({ msg: message, amount });

      setTimeout(() => {
        this._lastReward.set(null);
      }, 5000);
    }
  }
}