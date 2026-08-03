import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { StoreItem, StoreItemViewModel } from './models/store-item.model';
import { STORE_ITEMS_PROVIDER } from './models/store-items-provider.token';
import { HttpStoreItemsProvider } from './services/http-store-items.provider';
import { EconomyStoreService, PurchaseError } from './services/economy-store.service';
import { StoreItemCardComponent } from './component/shop-item-card.component';
import { StoreBalanceComponent } from './component/shop-balance.component';

type FilterType = 'all' | 'avatar' | 'banner';

interface PurchaseState {
  itemId: string | null;
  errorByItemId: Record<string, string>;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, StoreItemCardComponent, StoreBalanceComponent],
  providers: [
    { provide: STORE_ITEMS_PROVIDER, useClass: HttpStoreItemsProvider },
  ],
  template: `
    <div class="store">

      <header class="store__header">
        <div class="store__header-text">
          <h1 class="store__title">Tienda de Recompensas</h1>
          <p class="store__subtitle">Personalizá tu perfil con tus monedas ganadas.</p>
        </div>
        <app-store-balance
          [credits]="credits()"
          [isLoading]="isLoadingBalance()"
        />
      </header>

      <div *ngIf="globalError()" class="store__alert store__alert--error" role="alert">
        <span>⚠️ {{ globalError() }}</span>
        <button (click)="loadData()">Reintentar</button>
      </div>

      <div class="store__filters" role="group" aria-label="Filtrar por tipo">
        <button
          *ngFor="let f of filterOptions"
          class="store__filter-btn"
          [class.store__filter-btn--active]="activeFilter() === f.value"
          (click)="setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>

      <div *ngIf="isLoadingItems()" class="store__grid">
        <div *ngFor="let _ of skeletons" class="store__skeleton"></div>
      </div>

      <div *ngIf="!isLoadingItems() && !globalError()" class="store__grid">
        <app-store-item-card
          *ngFor="let item of filteredItems(); trackBy: trackById"
          [item]="item"
          [isLoading]="purchaseState().itemId === item.store_item_id"
          [errorMessage]="purchaseState().errorByItemId[item.store_item_id] || null"
          (purchase)="onPurchase($event)"
        />
      </div>

      <div
        *ngIf="!isLoadingItems() && !globalError() && filteredItems().length === 0"
        class="store__empty"
      >
        <p>No hay ítems disponibles en esta categoría.</p>
      </div>

    </div>
  `,
  styles: [`
    .store {
      padding: 2rem;
      background: #f5f9ff;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
    }

    .store__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .store__title {
      margin: 0 0 4px;
      font-size: 1.75rem;
      font-weight: 700;
      color: #0a4fbf;
    }
    .store__subtitle {
      margin: 0;
      color: #4c6c9a;
      font-size: 0.9rem;
    }

    .store__alert {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }
    .store__alert--error {
      background: #fdeaea;
      color: #d64545;
      border: 1px solid #f7d4d4;
    }
    .store__alert button {
      background: #d64545;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .store__alert button:hover { background: #b03636; }

    .store__filters {
      display: flex;
      gap: 8px;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .store__filter-btn {
      padding: 7px 18px;
      border-radius: 99px;
      border: 2px solid #c9e0ff;
      background: white;
      color: #4c6c9a;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .store__filter-btn:hover { border-color: #0a4fbf; color: #0a4fbf; }
    .store__filter-btn--active {
      background: #0a4fbf;
      border-color: #0a4fbf;
      color: white;
    }

    .store__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    .store__skeleton {
      height: 320px;
      border-radius: 16px;
      background: linear-gradient(90deg, #f5f9ff 25%, #c9e0ff 50%, #f5f9ff 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .store__empty {
      text-align: center;
      padding: 4rem;
      color: #8fb8e0;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .store { padding: 1rem; }
      .store__header { flex-direction: column; }
    }
  `],
})
export class ShopComponent implements OnInit {
  private readonly storeItemsProvider = inject(STORE_ITEMS_PROVIDER);
  private readonly economyService = inject(EconomyStoreService);

  private readonly allItems = signal<StoreItem[]>([]);
  private readonly ownedItemIds = signal<Set<string>>(new Set());

  readonly credits = signal<number>(0);
  readonly isLoadingBalance = signal<boolean>(true);
  readonly isLoadingItems = signal<boolean>(true);
  readonly globalError = signal<string | null>(null);
  readonly activeFilter = signal<FilterType>('all');
  readonly purchaseState = signal<PurchaseState>({ itemId: null, errorByItemId: {} });

  readonly skeletons = Array(6).fill(null);

  readonly filterOptions: { label: string; value: FilterType }[] = [
    { label: 'Todo', value: 'all' },
    { label: 'Avatares', value: 'avatar' },
    { label: 'Banners', value: 'banner' },
  ];

  readonly enrichedItems = computed<StoreItemViewModel[]>(() => {
    const balance = this.credits();
    const owned = this.ownedItemIds();

    return this.allItems().map((item) => ({
      ...item,
      status: owned.has(item.store_item_id)
        ? 'owned'
        : item.price > balance
          ? 'insufficient_funds'
          : 'available',
    }));
  });

  readonly filteredItems = computed<StoreItemViewModel[]>(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? this.enrichedItems()
      : this.enrichedItems().filter((i) => i.type === filter);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.globalError.set(null);
    this.isLoadingBalance.set(true);
    this.isLoadingItems.set(true);

    forkJoin({
      balance: this.economyService.getBalance(),
      items: this.storeItemsProvider.getItems(),
    }).subscribe({
      next: ({ balance, items }) => {
        this.credits.set(balance.credits);
        this.allItems.set(items);
        this.isLoadingBalance.set(false);
        this.isLoadingItems.set(false);
      },
      error: () => {
        this.globalError.set('No se pudo cargar la tienda. Verificá tu conexión.');
        this.isLoadingBalance.set(false);
        this.isLoadingItems.set(false);
      },
    });
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  onPurchase(itemId: string): void {
    this.purchaseState.update((s) => ({
      ...s,
      itemId,
      errorByItemId: { ...s.errorByItemId, [itemId]: '' },
    }));

    this.economyService.purchase(itemId).subscribe({
      next: (res) => {
        this.credits.set(res.newBalance);
        this.ownedItemIds.update((owned) => new Set([...owned, itemId]));
        this.purchaseState.update((s) => ({ ...s, itemId: null }));
      },
      error: (err: PurchaseError) => {
        this.purchaseState.update((s) => ({
          itemId: null,
          errorByItemId: { ...s.errorByItemId, [itemId]: err.message },
        }));
      },
    });
  }

  trackById(_: number, item: StoreItemViewModel): string {
    return item.store_item_id;
  }
}