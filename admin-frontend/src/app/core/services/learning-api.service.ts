import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
import { KeycloakService } from 'keycloak-angular';
import { Observable, from } from 'rxjs';
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LearningApiService {
  constructor(
<<<<<<< HEAD
    private apiService: ApiService
=======
    private apiService: ApiService,
    private keycloakService: KeycloakService
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
  ) {}

  /**
   * Registra la selección de categoría y dificultad del usuario en el sistema de aprendizaje
   */
  registerGameSelection(categoryId: string, difficultyId: string): Observable<any> {
<<<<<<< HEAD
    const userId = 'test-user';

=======
    const userId = this.keycloakService.getKeycloakInstance().subject;
    
    // Siguiendo la lógica del proyecto: 
    // 1. Establecemos la categoría como una preferencia (SetPreferencesDto)
    // 2. Iniciamos el método con la dificultad (InitMethodDto)
    
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
