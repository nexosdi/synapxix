import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DalaDecision, DalaTrace } from '../models/dala.models';
import { PaginatedResponse } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class DalaService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getDecisions(status: 'pending' | 'reviewed', page: number = 1, limit: number = 20): Observable<PaginatedResponse<DalaDecision>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<DalaDecision>>(`${this.api}/dala/v1/decisions`, { params });
  }

  getTrace(decisionId: string): Observable<DalaTrace> {
    return this.http.get<DalaTrace>(`${this.api}/dala/v1/traces/${decisionId}`);
  }

  reviewDecision(decisionId: string, verdict: 'approved' | 'rejected' | 'edited', reason: string): Observable<void> {
    return this.http.post<void>(`${this.api}/dala/v1/decisions/${decisionId}/review`, { verdict, reason });
  }
}
