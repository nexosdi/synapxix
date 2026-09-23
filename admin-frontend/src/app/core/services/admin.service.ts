import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserMetrics, PaginatedResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/admin';

  getUsers(page: number = 1, limit: number = 10, institutionId?: string): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    if (institutionId) {
      params = params.set('institutionId', institutionId);
    }

    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/users`, { params });
  }

  getUserMetrics(userId: string): Observable<UserMetrics> {
    return this.http.get<UserMetrics>(`${this.apiUrl}/users/${userId}/metrics`);
  }
}
