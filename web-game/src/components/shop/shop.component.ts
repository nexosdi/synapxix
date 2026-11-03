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
    <main class="store">
      <div class="store__container">

        <!-- Header -->
        <header class="store__header">
          <div class="store__header-text">
            <span class="store__header-badge">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
              Recompensas
            </span>
            <h1 class="store__title">Tienda Synapxix</h1>
            <p class="store__subtitle">Canjeá tus monedas ganadas y personalizá tu experiencia de juego.</p>
          </div>

          <app-store-balance
            [credits]="credits()"
            [isLoading]="isLoadingBalance()"
          />
        </header>

        <!-- Global error alert -->
        <div *ngIf="globalError()" class="store__alert store__alert--error" role="alert">
          <div class="store__alert-message">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>{{ globalError() }}</span>
          </div>
          <button type="button" class="store__alert-btn" (click)="loadData()">
            Reintentar
          </button>
        </div>

        <!-- Filter tabs (sin emojis) -->
        <nav class="store__filters" role="tablist" aria-label="Filtrar catálogo de productos">
          <button
            *ngFor="let f of filterOptions"
            type="button"
            role="tab"
            class="store__filter-btn"
            [class.store__filter-btn--active]="activeFilter() === f.value"
            [attr.aria-selected]="activeFilter() === f.value"
            (click)="setFilter(f.value)"
          >
            {{ f.label }}
          </button>
        </nav>

        <!-- Loading skeleton grid -->
        <div *ngIf="isLoadingItems()" class="store__grid" aria-busy="true" aria-label="Cargando catálogo...">
          <div *ngFor="let _ of skeletons" class="store__skeleton-card" aria-hidden="true">
            <div class="store__skeleton-preview"></div>
            <div class="store__skeleton-body">
              <div class="store__skeleton-line store__skeleton-line--title"></div>
              <div class="store__skeleton-line store__skeleton-line--desc"></div>
            </div>
            <div class="store__skeleton-footer">
              <div class="store__skeleton-line store__skeleton-line--price"></div>
              <div class="store__skeleton-line store__skeleton-line--btn"></div>
            </div>
          </div>
        </div>

        <!-- Real items grid -->
        <div *ngIf="!isLoadingItems() && !globalError() && filteredItems().length > 0" class="store__grid">
          <app-store-item-card
            *ngFor="let item of filteredItems(); trackBy: trackById"
            [item]="item"
            [isLoading]="purchaseState().itemId === item.store_item_id"
            [errorMessage]="purchaseState().errorByItemId[item.store_item_id] || null"
            (purchase)="onPurchase($event)"
          />
        </div>

        <!-- Empty state with high contrast & actionable button (sin emojis) -->
        <div
          *ngIf="!isLoadingItems() && !globalError() && filteredItems().length === 0"
          class="store__empty"
          role="region"
          aria-label="Catálogo vacío"
        >
          <div class="store__empty-icon-wrapper" aria-hidden="true">
            <svg class="store__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="44" height="44">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h2 class="store__empty-title">No hay ítems en esta categoría</h2>
          <p class="store__empty-text">
            No encontramos productos para la categoría seleccionada en este momento.
          </p>
          <button
            *ngIf="activeFilter() !== 'all'"
            type="button"
            class="store__empty-action"
            (click)="setFilter('all')"
          >
            Ver todos los ítems
          </button>
        </div>

      </div>
    </main>
  `,
  styleUrls: ['./shop.component.css'],
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
