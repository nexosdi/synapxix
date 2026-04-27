import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CognitiveElement } from '../models/CognitiveElement.model';

@Injectable({
  providedIn: 'root',
})
export class CognitiveService {
  private readonly apiUrl = 'http://localhost:3000/api/auth/preferences';

  constructor(private http: HttpClient) {}

  getElements(): Observable<CognitiveElement[]> {
    // ¡Ya no necesitas armar los headers aquí! 
    // El interceptor los inyectará automáticamente antes de salir.
    return this.http.get<CognitiveElement[]>(this.apiUrl);
  }
}