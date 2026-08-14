import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserReportData } from '../models/SessionReport.model';
import { environment } from '../../../environments/environment';

/**
 * Servicio para obtener el reporte de sesiones de juego del usuario autenticado.
 * El token Keycloak se inyecta automáticamente por `KeycloakBearerInterceptor`.
 */
@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private readonly apiUrl = `${environment.apiUrl}/game-session/me/report`;
  private readonly http = inject(HttpClient);

  /**
   * Obtiene el reporte de sesiones del usuario autenticado.
   * Endpoint: GET /api/game-session/me/report
   */
  getMyReport(): Observable<UserReportData> {
    return this.http.get<UserReportData>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error en GameSessionService.getMyReport:', error);
        return throwError(() => error);
      }),
    );
  }
}
