import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, retry } from 'rxjs'; 
import { CognitiveElement } from '../models/CognitiveElement.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CognitiveService {
  
  private readonly apiUrl = `${environment.apiUrl}/auth/preferences`;

  private readonly http = inject(HttpClient);

  getElements(): Observable<CognitiveElement[]> {
    return this.http.get<CognitiveElement[]>(this.apiUrl).pipe(
      retry(1), 
      catchError(error => {
        console.error('Error en CognitiveService:', error);
        
        return throwError(() => new Error('No se pudieron recuperar las métricas. Por favor, intenta de nuevo más tarde.'));
      })
    );
  }
}