import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningApiService {
  constructor(
    private apiService: ApiService
  ) {}

  /**
   * Registra la selección de categoría y dificultad del usuario en el sistema de aprendizaje
   */
  registerGameSelection(categoryId: string, difficultyId: string): Observable<any> {
    // Usuario mock (antes venía de Keycloak)
    const userId = 'demo-user';

    return this.apiService.post('learning/preferences', {
      userId: userId,
      prefKeys: [categoryId],
      initWeight: 0.5
    }).pipe(
      switchMap(() => {
        return this.apiService.post('learning/methods/init', {
          userId: userId,
          methodKey: difficultyId,
          initWeight: 0.5
        });
      })
    );
  }
}