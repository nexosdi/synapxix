import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
<<<<<<< HEAD
import { environment } from '../../../environments/environment';

=======
=======
import { environment } from '../../../environments/environment';
>>>>>>> 2a87e4a (feat: implement ApiService and environment configurations for centralized HTTP requests)

/**
 * Servicio centralizado para todas las peticiones HTTP al backend
 * Usa el interceptor AuthInterceptor para enviar el token automáticamente
 */
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
@Injectable({
  providedIn: 'root',
})
export class ApiService {
<<<<<<< HEAD
<<<<<<< HEAD
  private apiUrl = environment.apiUrl;
=======
  private apiUrl = 'http://localhost:3000/api'; // Cambiar según tu backend
>>>>>>> fa98438 (feat(chatbot): mover implementación del chatbot desde santiago-front)
=======
  private apiUrl = environment.apiUrl;
>>>>>>> 2a87e4a (feat: implement ApiService and environment configurations for centralized HTTP requests)

  constructor(private http: HttpClient) {}

  /**
   * GET genérico
   * @param endpoint Ruta sin /api (ej: 'categories', 'content/1')
   * @param params Parámetros opcionales (ej: { page: 1, limit: 10 })
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams });
  }

  /**
   * POST genérico
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  /**
   * PUT genérico
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  /**
   * PATCH genérico
   */
  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  /**
   * DELETE genérico
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
