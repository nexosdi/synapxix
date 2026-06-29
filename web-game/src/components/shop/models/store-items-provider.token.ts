import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreItem } from './store-item.model';

export interface StoreItemsProvider {
  getItems(): Observable<StoreItem[]>;
}

export const STORE_ITEMS_PROVIDER = new InjectionToken<StoreItemsProvider>(
  'STORE_ITEMS_PROVIDER'
);