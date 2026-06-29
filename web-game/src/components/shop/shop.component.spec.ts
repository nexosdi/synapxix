import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ShopComponent } from './shop.component';
import { STORE_ITEMS_PROVIDER } from './models/store-items-provider.token';
import { EconomyStoreService, PurchaseError } from './services/economy-store.service';
import { StoreItem } from './models/store-item.model';

describe('ShopComponent', () => {
  const mockItems: StoreItem[] = [
    {
      store_item_id: 'avatar_01',
      name: 'Avatar Clásico',
      type: 'avatar',
      price: 150,
      description: 'desc',
      preview_url: 'url',
      is_active: true,
    },
    {
      store_item_id: 'banner_01',
      name: 'Banner Verano',
      type: 'banner',
      price: 220,
      description: 'desc',
      preview_url: 'url',
      is_active: true,
    },
  ];

  let storeItemsProviderMock: { getItems: jest.Mock };
  let economyServiceMock: { getBalance: jest.Mock; purchase: jest.Mock };

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [ShopComponent],
      providers: [
        { provide: STORE_ITEMS_PROVIDER, useValue: storeItemsProviderMock },
        { provide: EconomyStoreService, useValue: economyServiceMock },
      ],
    }).overrideComponent(ShopComponent, {
      set: {
        providers: [
          { provide: STORE_ITEMS_PROVIDER, useValue: storeItemsProviderMock },
          { provide: EconomyStoreService, useValue: economyServiceMock },
        ],
      },
    });

    const fixture = TestBed.createComponent(ShopComponent);
    return fixture;
  }

  beforeEach(() => {
    storeItemsProviderMock = {
      getItems: jest.fn().mockReturnValue(of(mockItems)),
    };
    economyServiceMock = {
      getBalance: jest.fn().mockReturnValue(of({ credits: 300, experience_points: 0 })),
      purchase: jest.fn(),
    };
  });

  it('debería cargar balance e items al inicializar', () => {
    const fixture = createComponent();
    fixture.detectChanges(); // dispara ngOnInit

    const component = fixture.componentInstance;
    expect(component.credits()).toBe(300);
    expect(component.filteredItems().length).toBe(2);
    expect(component.isLoadingItems()).toBe(false);
    expect(component.isLoadingBalance()).toBe(false);
    expect(component.globalError()).toBeNull();
  });

  it('debería setear globalError si falla la carga de balance o items', () => {
    economyServiceMock.getBalance.mockReturnValue(
      throwError(() => ({ type: 'UNKNOWN', message: 'error' }))
    );

    const fixture = createComponent();
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.globalError()).toBe('No se pudo cargar la tienda. Verificá tu conexión.');
    expect(component.isLoadingItems()).toBe(false);
    expect(component.isLoadingBalance()).toBe(false);
  });

  describe('enrichedItems / filteredItems', () => {
    it('debería marcar un ítem como insufficient_funds si el precio supera el balance', () => {
      economyServiceMock.getBalance.mockReturnValue(of({ credits: 100, experience_points: 0 }));

      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      const avatar = component
        .filteredItems()
        .find((i) => i.store_item_id === 'avatar_01'); // precio 150 > balance 100

      expect(avatar?.status).toBe('insufficient_funds');
    });

    it('debería marcar un ítem como available si el balance alcanza', () => {
      const fixture = createComponent();
      fixture.detectChanges(); // balance default = 300

      const component = fixture.componentInstance;
      const avatar = component
        .filteredItems()
        .find((i) => i.store_item_id === 'avatar_01'); // precio 150 <= balance 300

      expect(avatar?.status).toBe('available');
    });

    it('debería filtrar por tipo correctamente', () => {
      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.setFilter('banner');

      const filtered = component.filteredItems();
      expect(filtered.length).toBe(1);
      expect(filtered[0].store_item_id).toBe('banner_01');
    });

    it('"all" debería devolver todos los ítems sin filtrar', () => {
      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.setFilter('avatar');
      component.setFilter('all');

      expect(component.filteredItems().length).toBe(2);
    });
  });

  describe('onPurchase', () => {
    it('en éxito: actualiza credits, agrega el ítem a ownedItemIds y limpia el loading', () => {
      economyServiceMock.purchase.mockReturnValue(
        of({
          status: 'success',
          purchaseId: 'p1',
          itemId: 'avatar_01',
          itemName: 'Avatar Clásico',
          itemType: 'avatar',
          creditsSpent: 150,
          newBalance: 150,
          processedAt: new Date(),
        })
      );

      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.onPurchase('avatar_01');

      expect(component.credits()).toBe(150);
      expect(component.purchaseState().itemId).toBeNull();

      const purchasedItem = component
        .filteredItems()
        .find((i) => i.store_item_id === 'avatar_01');
      expect(purchasedItem?.status).toBe('owned');
    });

    it('en error: guarda el mensaje en errorByItemId y limpia el loading', () => {
      const purchaseError: PurchaseError = {
        type: 'INSUFFICIENT_FUNDS',
        message: 'Créditos insuficientes para esta compra.',
      };
      economyServiceMock.purchase.mockReturnValue(throwError(() => purchaseError));

      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.onPurchase('avatar_01');

      expect(component.purchaseState().itemId).toBeNull();
      expect(component.purchaseState().errorByItemId['avatar_01']).toBe(
        'Créditos insuficientes para esta compra.'
      );
      expect(component.credits()).toBe(300);
    });

    it('debería marcar isLoading=true para el ítem mientras la compra está en curso', () => {
      let resolveFn: ((value: unknown) => void) | undefined;
      economyServiceMock.purchase.mockReturnValue(
        new (require('rxjs').Observable)((subscriber: { next: (v: unknown) => void; complete: () => void }) => {
          resolveFn = (value) => {
            subscriber.next(value);
            subscriber.complete();
          };
        })
      );

      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.onPurchase('avatar_01');

      expect(component.purchaseState().itemId).toBe('avatar_01');

      resolveFn?.({
        status: 'success',
        purchaseId: 'p1',
        itemId: 'avatar_01',
        itemName: 'Avatar Clásico',
        itemType: 'avatar',
        creditsSpent: 150,
        newBalance: 150,
        processedAt: new Date(),
      });
    });
  });

  describe('loadData (reintentar)', () => {
    it('debería limpiar el globalError y volver a pedir balance + items', () => {
      const fixture = createComponent();
      fixture.detectChanges();

      const component = fixture.componentInstance;
      economyServiceMock.getBalance.mockClear();
      storeItemsProviderMock.getItems.mockClear();

      component.loadData();

      expect(economyServiceMock.getBalance).toHaveBeenCalledTimes(1);
      expect(storeItemsProviderMock.getItems).toHaveBeenCalledTimes(1);
      expect(component.globalError()).toBeNull();
    });
  });
});