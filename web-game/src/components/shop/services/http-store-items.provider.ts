import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { StoreItem } from '../models/store-item.model';
import { StoreItemsProvider } from '../models/store-items-provider.token';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpStoreItemsProvider implements StoreItemsProvider {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/economy/items`;

  getItems(): Observable<StoreItem[]> {
    return this.http.get<StoreItem[]>(this.baseUrl).pipe(
      catchError(() =>
        throwError(() => new Error('Failed to load store items.'))
      )
    );
  }
}