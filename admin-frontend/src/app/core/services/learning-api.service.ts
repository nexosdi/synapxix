import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
    const userId = 'test-user';

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