import { Injectable, NgZone, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Low-level service for consuming Server-Sent Events (SSE) via POST requests.
 *
 * Unlike the browser-native `EventSource` API (which only supports GET),
 * this service uses `fetch()` with a `ReadableStream` to enable SSE over
 * POST — allowing JSON payloads of any size in the request body.
 *
 * Features:
 * - Sends POST requests with JSON body to SSE endpoints
 * - Parses the SSE protocol (`event: chunk`, `event: done`, `event: error`)
 * - Returns an `Observable<string>` that emits each text chunk
 * - Supports clean cancellation via `AbortController`
 * - Runs stream reading outside Angular zone for performance
 *
 * @example
 * ```typescript
 * const { stream$, abort } = sseService.streamPost('/api/research/process/stream', {
 *   gameType: 'fill-in-the-blanks',
 *   gameInput: { ... },
 *   studentResult: { ... },
 *   studentId: 'abc'
 * });
 *
 * stream$.subscribe({
 *   next: (chunk) => console.log('Received:', chunk),
 *   complete: () => console.log('Stream finished'),
 *   error: (err) => console.error('Stream error:', err),
 * });
 *
 * // To cancel early:
 * abort();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SseStreamService {
  private readonly ngZone = inject(NgZone);

  /**
   * Opens an SSE connection via POST and returns a stream of text chunks.
   *
   * @param url  - The SSE endpoint URL (e.g. `/api/research/process/stream`)
   * @param body - The JSON-serializable payload to send as the request body
   * @returns An object with:
   *   - `stream$`: Observable that emits each chunk's text content
   *   - `abort`: Function to cancel the connection at any time
   */
  streamPost(url: string, body: unknown): { stream$: Observable<string>; abort: () => void } {
    const controller = new AbortController();

    const stream$ = new Observable<string>((subscriber) => {
      // Run the fetch + stream reading outside Angular zone to avoid
      // triggering change detection on every byte read from the stream.
      this.ngZone.runOutsideAngular(() => {
        this.consumeStream(url, body, controller.signal, subscriber);
      });

      // Teardown: abort the fetch if the subscriber unsubscribes
      return () => {
        if (!controller.signal.aborted) {
          controller.abort();
        }
      };
    });

    return {
      stream$,
      abort: () => controller.abort(),
    };
  }

  /**
   * Internal method that performs the fetch and reads the SSE stream.
   * Parses the SSE protocol line by line and dispatches events to the subscriber.
   */
  private async consumeStream(
    url: string,
    body: unknown,
    signal: AbortSignal,
    subscriber: import('rxjs').Subscriber<string>,
  ): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        throw new Error(`SSE request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null — streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Stream ended without a 'done' event — complete gracefully
          if (!subscriber.closed) {
            subscriber.complete();
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by double newlines
        const messages = buffer.split('\n\n');
        // Keep the last (potentially incomplete) fragment in the buffer
        buffer = messages.pop() ?? '';

        for (const message of messages) {
          if (subscriber.closed) return;

          const lines = message.split('\n');

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              const data = line.slice(6);
              this.handleSseEvent(currentEvent, data, subscriber);
              currentEvent = ''; // Reset after handling
            }
          }
        }
      }
    } catch (error: unknown) {
      // AbortError is expected when we cancel — don't emit as an error
      if (error instanceof Error && error.name === 'AbortError') {
        if (!subscriber.closed) {
          subscriber.complete();
        }
        return;
      }

      if (!subscriber.closed) {
        subscriber.error(error);
      }
    }
  }

  /**
   * Dispatches a parsed SSE event to the subscriber.
   *
   * Protocol:
   * - `event: chunk` → `data: {"text": "..."}` → emit the text
   * - `event: done`  → `data: [DONE]` → complete the observable
   * - `event: error` → `data: {"message": "..."}` → error the observable
   */
  private handleSseEvent(
    event: string,
    data: string,
    subscriber: import('rxjs').Subscriber<string>,
  ): void {
    switch (event) {
      case 'chunk': {
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            // Emit inside Angular zone so the UI picks up the change
            this.ngZone.run(() => subscriber.next(parsed.text));
          }
        } catch {
          // If parsing fails, emit the raw data as a fallback
          this.ngZone.run(() => subscriber.next(data));
        }
        break;
      }

      case 'done': {
        if (!subscriber.closed) {
          this.ngZone.run(() => subscriber.complete());
        }
        break;
      }

      case 'error': {
        try {
          const parsed = JSON.parse(data);
          this.ngZone.run(() =>
            subscriber.error(new Error(parsed.message || 'SSE stream error')),
          );
        } catch {
          this.ngZone.run(() => subscriber.error(new Error(data)));
        }
        break;
      }

      default: {
        // Unknown event type or no event specified — try to emit as chunk
        if (data && data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              this.ngZone.run(() => subscriber.next(parsed.text));
            }
          } catch {
            // Ignore unparseable data for unknown events
          }
        }
        break;
      }
    }
  }
}
