// ⚠️ MOCK TEMPORAL — solo para testear la UI de la tienda sin un usuario real en la DB.
// Borrar este archivo y la línea de `providers` en shop.component.ts cuando ya no se necesite.

import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  BalanceResponse,
  PurchaseResponse,
  PurchaseError,
} from './economy-store.service';

@Injectable()
export class MockEconomyStoreService {
  private mockCredits = 300;

  private readonly mockOwnedItemIds = new Set<string>([
  ]);

  getBalance(): Observable<BalanceResponse> {
    return of({
      credits: this.mockCredits,
      experience_points: 1250,
    }).pipe(delay(400)); 
  }

  purchase(itemId: string): Observable<PurchaseResponse> {
    if (this.mockOwnedItemIds.has(itemId)) {
      const err: PurchaseError = {
        type: 'ALREADY_OWNED',
        message: 'Ya tenés este ítem en tu inventario.',
      };
      return throwError(() => err).pipe(delay(400));
    }

    const mockPrices: Record<string, number> = {
      avatar_01: 150,
      avatar_02: 320,
      banner_01: 220,
    };
    const price = mockPrices[itemId] ?? 999999;

    if (price > this.mockCredits) {
      const err: PurchaseError = {
        type: 'INSUFFICIENT_FUNDS',
        message: 'Créditos insuficientes para esta compra.',
      };
      return throwError(() => err).pipe(delay(400));
    }

    this.mockCredits -= price;
    this.mockOwnedItemIds.add(itemId);

    const res: PurchaseResponse = {
      status: 'success',
      purchaseId: `mock_purchase_${Date.now()}`,
      itemId,
      itemName: itemId,
      itemType: 'avatar',
      creditsSpent: price,
      newBalance: this.mockCredits,
      processedAt: new Date(),
    };

    return of(res).pipe(delay(400));
  }
}