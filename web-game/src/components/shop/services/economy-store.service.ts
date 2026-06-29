import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BalanceResponse {
  credits: number;
  experience_points: number;
}

export interface PurchaseResponse {
  status: 'success';
  purchaseId: string;
  itemId: string;
  itemName: string;
  itemType: string;
  creditsSpent: number;
  newBalance: number;
  processedAt: Date;
}

export interface PurchaseError {
  type: 'INSUFFICIENT_FUNDS' | 'ALREADY_OWNED' | 'ITEM_NOT_FOUND' | 'UNKNOWN';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EconomyStoreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/economy`;

  getBalance(): Observable<BalanceResponse> {
    return this.http.get<BalanceResponse>(`${this.baseUrl}/balance`).pipe(
      catchError(() =>
        throwError(() => ({ type: 'UNKNOWN', message: 'No se pudo obtener el saldo.' }))
      )
    );
  }

  purchase(itemId: string): Observable<PurchaseResponse> {
    return this.http
      .post<PurchaseResponse>(`${this.baseUrl}/purchase`, { itemId })
      .pipe(catchError((err) => throwError(() => this.mapPurchaseError(err))));
  }

  private mapPurchaseError(err: { status: number; error?: { message?: string } }): PurchaseError {
    if (err.status === 400) {
      return { type: 'INSUFFICIENT_FUNDS', message: 'Créditos insuficientes para esta compra.' };
    }
    if (err.status === 409) {
      return { type: 'ALREADY_OWNED', message: 'Ya tenés este ítem en tu inventario.' };
    }
    if (err.status === 404) {
      return { type: 'ITEM_NOT_FOUND', message: 'El ítem no está disponible.' };
    }
    return { type: 'UNKNOWN', message: 'Ocurrió un error. Intentá de nuevo.' };
  }
}