import { TestBed } from '@angular/core/testing';
import { firstValueFrom, toArray } from 'rxjs';

import { SseStreamService } from './sse-stream.service';
 
const encoder = new TextEncoder();

function sseChunk(text: string): Uint8Array {
  return encoder.encode(`event: chunk\ndata: ${JSON.stringify({ text })}\n\n`);
}

 function sseDone(): Uint8Array {
  return encoder.encode('event: done\ndata: [DONE]\n\n');
}

 function sseError(message: string): Uint8Array {
  return encoder.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
}

 
function makeStream(...chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

 function mockFetch(
  body: ReadableStream<Uint8Array> | null,
  ok = true,
  status = 200,
): void {
  (global.fetch as jest.Mock).mockResolvedValue({ ok, status, body });
}

describe('SseStreamService', () => {
  let service: SseStreamService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [SseStreamService],
    });

    service = TestBed.inject(SseStreamService);

    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('streamPost — configuración de fetch', () => {
    it('should call fetch with POST method, correct URL and JSON-encoded body', async () => {
      mockFetch(makeStream(sseDone()));

      const { stream$ } = service.streamPost('/api/test', { key: 'value' });
      await firstValueFrom(stream$.pipe(toArray()));

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'value' }),
        }),
      );
    });
  });

  describe('streamPost — emisión de chunks', () => {
    it('should emit text extracted from "chunk" events', async () => {
      mockFetch(makeStream(sseChunk('hola'), sseChunk(' mundo'), sseDone()));

      const { stream$ } = service.streamPost('/api/test', {});
      const chunks = await firstValueFrom(stream$.pipe(toArray()));

      expect(chunks).toEqual(['hola', ' mundo']);
    });

    it('should emit nothing and complete when only a "done" event is received', async () => {
      mockFetch(makeStream(sseDone()));

      const { stream$ } = service.streamPost('/api/test', {});
      const chunks = await firstValueFrom(stream$.pipe(toArray()));

      expect(chunks).toEqual([]);
    });

    it('should complete gracefully when stream closes without a "done" event', async () => {
      mockFetch(makeStream(sseChunk('único')));

      const { stream$ } = service.streamPost('/api/test', {});
      const chunks = await firstValueFrom(stream$.pipe(toArray()));

      expect(chunks).toEqual(['único']);
    });

    it('should handle multiple chunks arriving in a single network read', async () => {
      const combined = encoder.encode(
        `event: chunk\ndata: ${JSON.stringify({ text: 'A' })}\n\n` +
        `event: chunk\ndata: ${JSON.stringify({ text: 'B' })}\n\n` +
        `event: done\ndata: [DONE]\n\n`,
      );
      mockFetch(
        new ReadableStream({
          start(controller) {
            controller.enqueue(combined);
            controller.close();
          },
        }),
      );

      const { stream$ } = service.streamPost('/api/test', {});
      const chunks = await firstValueFrom(stream$.pipe(toArray()));

      expect(chunks).toEqual(['A', 'B']);
    });
  });

  describe('streamPost — manejo de errores', () => {
    it('should emit an error when an "error" SSE event is received', async () => {
      mockFetch(makeStream(sseError('algo salió mal')));

      const { stream$ } = service.streamPost('/api/test', {});

      await expect(firstValueFrom(stream$.pipe(toArray()))).rejects.toThrow(
        'algo salió mal',
      );
    });

    it('should error when response.ok is false', async () => {
      mockFetch(null, false, 503);

      const { stream$ } = service.streamPost('/api/test', {});

      await expect(firstValueFrom(stream$.pipe(toArray()))).rejects.toThrow(
        'SSE request failed with status 503',
      );
    });

    it('should error when response.body is null', async () => {
      mockFetch(null, true, 200);

      const { stream$ } = service.streamPost('/api/test', {});

      await expect(firstValueFrom(stream$.pipe(toArray()))).rejects.toThrow(
        'Response body is null',
      );
    });
  });

  describe('streamPost — cancelación y memory leaks', () => {
    it('should call abort() on the AbortController when abort() is called', () => {
      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      (global.fetch as jest.Mock).mockImplementation(() => new Promise(jest.fn()));

      const { abort } = service.streamPost('/api/test', {});
      abort();

      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should abort the fetch when the subscriber unsubscribes (no memory leak)', () => {
      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      (global.fetch as jest.Mock).mockImplementation(() => new Promise(jest.fn()));

      const { stream$ } = service.streamPost('/api/test', {});
      const subscription = stream$.subscribe();

      subscription.unsubscribe();

      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should NOT call abort() again if already aborted before unsubscribe', () => {
      const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

      (global.fetch as jest.Mock).mockImplementation(() => new Promise(jest.fn()));

      const { stream$, abort } = service.streamPost('/api/test', {});
      const subscription = stream$.subscribe();

      abort(); 
      subscription.unsubscribe();

      expect(abortSpy).toHaveBeenCalledTimes(1);
    });

    it('should complete (not error) when fetch rejects with an AbortError', async () => {
      const abortError = new DOMException('The operation was aborted.', 'AbortError');
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      const { stream$ } = service.streamPost('/api/test', {});
      const chunks = await firstValueFrom(stream$.pipe(toArray()));

      expect(chunks).toEqual([]);
    });
  });
});
