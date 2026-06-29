import { Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { StoreItem } from '../models/store-item.model';
import { StoreItemsProvider } from '../models/store-items-provider.token';

@Injectable({ providedIn: 'root' })
export class MockStoreItemsProvider implements StoreItemsProvider {
  private readonly items: StoreItem[] = [
    {
      store_item_id: 'avatar_01',
      name: 'Avatar Clásico',
      type: 'avatar',
      price: 150,
      description: 'Un avatar clásico para destacarte.',
      preview_url:
        'https://placehold.co/300x200?text=Avatar+Clasico',
      is_active: true,
    },
    {
      store_item_id: 'avatar_02',
      name: 'Avatar Pro',
      type: 'avatar',
      price: 320,
      description: 'Un avatar pro con estilo premium.',
      preview_url:
        'https://placehold.co/300x200?text=Avatar+Pro',
      is_active: true,
    },
    {
      store_item_id: 'banner_01',
      name: 'Banner Verano',
      type: 'banner',
      price: 220,
      description: 'Banner temático de verano.',
      preview_url:
        'https://placehold.co/300x200?text=Banner+Verano',
      is_active: true,
    },
  ];

  getItems(): Observable<StoreItem[]> {
    return of(this.items.filter((i) => i.is_active));
  }
}

