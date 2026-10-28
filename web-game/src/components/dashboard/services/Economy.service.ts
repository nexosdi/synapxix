import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BalanceData } from '../models/DashboardData.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para consultar la economía del usuario autenticado.
 * El token Keycloak se inyecta automáticamente por `KeycloakBearerInterceptor`
 * configurado en `app.config.ts` — no requiere lógica de auth aquí.
 */
@Injectable({ providedIn: 'root' })
export class EconomyService {
  private readonly apiUrl = `${environment.apiUrl}/economy/balance`;
  private readonly http = inject(HttpClient);

  /**
   * Obtiene el saldo actual del usuario autenticado.
   * @returns Observable con `{ credits, experience_points }`.
   */
  getBalance(): Observable<BalanceData> {
    return this.http.get<BalanceData>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error en EconomyService.getBalance:', error);
        return throwError(() => error);
      }),
    );
  }
}
