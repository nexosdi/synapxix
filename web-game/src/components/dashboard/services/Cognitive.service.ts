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
    // 1. Agarramos el token real que se creó y guardó en el navegador
    // (Asegúrate de que 'access_token' sea el nombre exacto de la llave que usaste)
    const token = localStorage.getItem('access_token'); 

    // 2. Si hay un token, lo inyectamos en las cabeceras
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // 3. Enviamos la petición con la identificación correcta
    return this.http.get<CognitiveElement[]>(this.apiUrl, { headers });
  }
}