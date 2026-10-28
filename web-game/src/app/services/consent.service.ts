import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConsentDto {
  version: string;
  scope: string;
  status: 'GRANTED' | 'REVOKED';
}

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private http = inject(HttpClient);
  
  getCurrentConsent(scope = 'research'): Observable<ConsentDto | null> {
    return this.http.get<ConsentDto | null>(`/api/consent/current?scope=${scope}`);
  }

  updateConsent(dto: ConsentDto): Observable<ConsentDto> {
    return this.http.post<ConsentDto>(`/api/consent`, dto);
  }
}
