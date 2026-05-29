import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
<<<<<<< HEAD
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
import { KeycloakService } from 'keycloak-angular';
import { Observable, from } from 'rxjs';
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
import { switchMap } from 'rxjs/operators';
=======
import { Observable, switchMap } from 'rxjs';
>>>>>>> 77a51fb (eliminar keycloak)

@Injectable({
  providedIn: 'root'
})
export class LearningApiService {
  constructor(
<<<<<<< HEAD
<<<<<<< HEAD
    private apiService: ApiService
=======
    private apiService: ApiService,
    private keycloakService: KeycloakService
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
    private apiService: ApiService
>>>>>>> 77a51fb (eliminar keycloak)
  ) {}

  /**
   * Registra la selección de categoría y dificultad del usuario en el sistema de aprendizaje
   */
  registerGameSelection(categoryId: string, difficultyId: string): Observable<any> {
<<<<<<< HEAD
<<<<<<< HEAD
    const userId = 'test-user';

=======
    const userId = this.keycloakService.getKeycloakInstance().subject;
    
    // Siguiendo la lógica del proyecto: 
    // 1. Establecemos la categoría como una preferencia (SetPreferencesDto)
    // 2. Iniciamos el método con la dificultad (InitMethodDto)
    
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
    // Usuario mock (antes venía de Keycloak)
    const userId = 'demo-user';

>>>>>>> 77a51fb (eliminar keycloak)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
}
>>>>>>> 77a51fb (eliminar keycloak)
