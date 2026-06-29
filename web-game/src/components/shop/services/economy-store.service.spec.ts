import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { EconomyStoreService, BalanceResponse, PurchaseResponse } from './economy-store.service';
import { environment } from '../../../environments/environment';

describe('EconomyStoreService', () => {
  let service: EconomyStoreService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/economy`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EconomyStoreService],
    });

    service = TestBed.inject(EconomyStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden requests sin resolver (evita falsos positivos)
    httpMock.verify();
  });

  describe('getBalance', () => {
    it('debería devolver el balance cuando el endpoint responde 200', () => {
      const mockResponse: BalanceResponse = {
        credits: 500,
        experience_points: 1200,
      };

      let result: BalanceResponse | undefined;
      service.getBalance().subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${baseUrl}/balance`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('debería mapear cualquier error HTTP a { type: UNKNOWN }', () => {
      let error: { type: string; message: string } | undefined;
      service.getBalance().subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/balance`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(error).toEqual({
        type: 'UNKNOWN',
        message: 'No se pudo obtener el saldo.',
      });
    });

    it('debería mapear un 401 (sesión expirada) también a UNKNOWN', () => {
      // Documenta el comportamiento actual: el servicio no distingue 401
      // de otros errores. Si en el futuro se agrega un mensaje específico
      // para sesión expirada, este test debe actualizarse.
      let error: { type: string } | undefined;
      service.getBalance().subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/balance`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(error?.type).toBe('UNKNOWN');
    });
  });

  describe('purchase', () => {
    const itemId = 'avatar_01';

    it('debería devolver PurchaseResponse en una compra exitosa', () => {
      const mockResponse: PurchaseResponse = {
        status: 'success',
        purchaseId: 'purchase_123',
        itemId,
        itemName: 'Avatar Clásico',
        itemType: 'avatar',
        creditsSpent: 150,
        newBalance: 350,
        processedAt: new Date(),
      };

      let result: PurchaseResponse | undefined;
      service.purchase(itemId).subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${baseUrl}/purchase`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ itemId });
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
    });

    it('debería mapear un 400 a INSUFFICIENT_FUNDS', () => {
      let error: { type: string; message: string } | undefined;
      service.purchase(itemId).subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/purchase`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

      expect(error).toEqual({
        type: 'INSUFFICIENT_FUNDS',
        message: 'Créditos insuficientes para esta compra.',
      });
    });

    it('debería mapear un 409 a ALREADY_OWNED', () => {
      let error: { type: string; message: string } | undefined;
      service.purchase(itemId).subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/purchase`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });

      expect(error).toEqual({
        type: 'ALREADY_OWNED',
        message: 'Ya tenés este ítem en tu inventario.',
      });
    });

    it('debería mapear un 404 a ITEM_NOT_FOUND', () => {
      let error: { type: string; message: string } | undefined;
      service.purchase(itemId).subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/purchase`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(error).toEqual({
        type: 'ITEM_NOT_FOUND',
        message: 'El ítem no está disponible.',
      });
    });

    it('debería mapear cualquier otro status (ej. 500) a UNKNOWN', () => {
      let error: { type: string; message: string } | undefined;
      service.purchase(itemId).subscribe({
        next: () => fail('no debería emitir next en caso de error'),
        error: (err) => (error = err),
      });

      const req = httpMock.expectOne(`${baseUrl}/purchase`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(error).toEqual({
        type: 'UNKNOWN',
        message: 'Ocurrió un error. Intentá de nuevo.',
      });
    });
  });
});