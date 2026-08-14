import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { CognitiveElement } from '../models/CognitiveElement.model';
import { CognitiveMetrics, StudentProgressData } from '../models/DashboardData.model';
import { environment } from '../../../environments/environment';

/**
 * Colores de la paleta de marca para los elementos cognitivos.
 * Refleja los tokens `--sx-chart-*` de `libs/brand/src/tokens.css`.
 */
const METRIC_COLORS: Record<string, string> = {
  accuracy: '#1e90ff',
  memory_retention: '#0a4fbf',
  attention_span: '#93c6ff',
  cognitive_load: '#4aa3a3',
};

/**
 * Mapea la respuesta del backend (`CognitiveMetrics`) al modelo visual
 * `CognitiveElement[]` que consumen `CognitiveCard` y `CognitiveChart`.
 * La `history` se inicializa vacía porque el endpoint individual-average no
 * devuelve serie temporal; es el promedio acumulado del usuario.
 */
function mapMetricsToElements(metrics: CognitiveMetrics): CognitiveElement[] {
  return [
    {
      id: 'accuracy',
      name: 'Precisión',
      current_score: Math.round(metrics.accuracy * 100),
      color: METRIC_COLORS['accuracy'],
      history: [],
    },
    {
      id: 'memory_retention',
      name: 'Memoria',
      current_score: Math.round(metrics.memory_retention * 100),
      color: METRIC_COLORS['memory_retention'],
      history: [],
    },
    {
      id: 'attention_span',
      name: 'Atención',
      current_score: Math.round(metrics.attention_span * 100),
      color: METRIC_COLORS['attention_span'],
      history: [],
    },
    {
      id: 'cognitive_load',
      name: 'Carga Cognitiva',
      // cognitive_load: valor más bajo = mejor; invertimos para mostrar "rendimiento"
      current_score: Math.round((1 - metrics.cognitive_load) * 100),
      color: METRIC_COLORS['cognitive_load'],
      history: [],
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class CognitiveService {
  private readonly http = inject(HttpClient);

  /**
   * Obtiene las métricas cognitivas del usuario y las mapea al formato
   * visual que usan `CognitiveCard` y `CognitiveChart`.
   * @param userId Sub (ID) del usuario autenticado en Keycloak.
   */
  getElements(userId: string): Observable<CognitiveElement[]> {
    const url = `${environment.apiUrl}/analytics/individual-average/${userId}`;
    return this.http.get<CognitiveMetrics>(url).pipe(
      map((metrics) => mapMetricsToElements(metrics)),
      catchError((error) => {
        console.error('Error en CognitiveService.getElements:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Obtiene el progreso curricular general del alumno (0–1).
   * @param userId Sub (ID) del usuario autenticado en Keycloak.
   */
  getStudentProgress(userId: string): Observable<StudentProgressData> {
    const url = `${environment.apiUrl}/analytics/student-progress/${userId}`;
    return this.http.get<StudentProgressData>(url).pipe(
      catchError((error) => {
        console.error('Error en CognitiveService.getStudentProgress:', error);
        return throwError(() => error);
      }),
    );
  }
}