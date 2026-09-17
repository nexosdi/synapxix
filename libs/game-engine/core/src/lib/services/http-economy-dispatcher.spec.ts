import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpEconomyDispatcher } from './http-economy-dispatcher';
import { EconomyClaimPayload } from './economy-dispatcher';

describe('HttpEconomyDispatcher', () => {
  let dispatcher: HttpEconomyDispatcher;
  let httpMock: HttpTestingController;

  const ENDPOINT = '/api/economy/claim-reward';

  const payload: EconomyClaimPayload = {
    gameSessionId: 'session-abc-123',
    score: 100,
    victory: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpEconomyDispatcher],
    });

    dispatcher = TestBed.inject(HttpEconomyDispatcher);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

 
  describe('dispatch — happy path', () => {
    it('should POST to the correct endpoint', async () => {
      const dispatchPromise = dispatcher.dispatch(payload);

      const req = httpMock.expectOne(ENDPOINT);
      expect(req.request.method).toBe('POST');
      req.flush(null);

      await dispatchPromise;
    });

    it('should send the full payload in the request body', async () => {
      const dispatchPromise = dispatcher.dispatch(payload);

      const req = httpMock.expectOne(ENDPOINT);
      expect(req.request.body).toEqual(payload);
      req.flush(null);

      await dispatchPromise;
    });

    it('should resolve to undefined on a 200 response (fire-and-forget)', async () => {
      const dispatchPromise = dispatcher.dispatch(payload);
      httpMock.expectOne(ENDPOINT).flush(null);

      await expect(dispatchPromise).resolves.toBeUndefined();
    });
  });

  describe('dispatch — manejo de errores', () => {
    it('should call console.warn and resolve (not throw) on a 409 Conflict', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const dispatchPromise = dispatcher.dispatch(payload);

      httpMock.expectOne(ENDPOINT).flush(
        { message: 'Session already claimed' },
        { status: 409, statusText: 'Conflict' },
      );

      await expect(dispatchPromise).resolves.toBeUndefined();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Session already claimed'),
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(payload.gameSessionId),
      );

      warnSpy.mockRestore();
    });

    it('should NOT call console.error when receiving a 409 (silent path)', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();

      const dispatchPromise = dispatcher.dispatch(payload);

      httpMock.expectOne(ENDPOINT).flush(
        { message: 'Conflict' },
        { status: 409, statusText: 'Conflict' },
      );

      await dispatchPromise;

      expect(errorSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
      jest.restoreAllMocks();
    });

    it('should call console.error and resolve (not throw) on a 500 error', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      const dispatchPromise = dispatcher.dispatch(payload);

      httpMock.expectOne(ENDPOINT).flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Server Error' },
      );

      await expect(dispatchPromise).resolves.toBeUndefined();

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[EconomyDispatcher] Failed to dispatch reward'),
        expect.any(HttpErrorResponse),
      );

      errorSpy.mockRestore();
    });

    it('should call console.error and resolve (not throw) on a 503 error', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      const dispatchPromise = dispatcher.dispatch(payload);

      httpMock.expectOne(ENDPOINT).flush(
        { message: 'Service Unavailable' },
        { status: 503, statusText: 'Service Unavailable' },
      );

      await expect(dispatchPromise).resolves.toBeUndefined();
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });
  });
});
