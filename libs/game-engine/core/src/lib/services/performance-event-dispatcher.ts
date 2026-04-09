import { InjectionToken } from '@angular/core';
import { PerformanceEvent } from '../models/performance-event.model';

/**
 * Contract for dispatching performance events to an external sink.
 *
 * Implementations:
 * - ConsoleEventDispatcher : logs to `console.table` during development
 * - (Future) HttpEventDispatcher : POST batches to the NestJS API
 * - (Future) IndexedDbDispatcher : persist locally for offline-first
 *
 * This follows the same provider-abstraction pattern used by
 * `HistoryDataProvider` / `HISTORY_DATA_PROVIDER` elsewhere in the
 * engine, keeping the core library backend-agnostic.
 */
export interface PerformanceEventDispatcher {
  /**
   * Receives a batch of events and sends them to the configured sink.
   * Called from an idle callback so implementations don't need to
   * worry about blocking the UI thread.
   */
  dispatch(events: PerformanceEvent[]): Promise<void>;
}

/**
 * Angular DI token for the PerformanceEventDispatcher.
 *
 * Usage in a module / route config:
 * ```ts
 * providers: [
 *   { provide: PERFORMANCE_EVENT_DISPATCHER, useClass: ConsoleEventDispatcher }
 * ]
 * ```
 */
export const PERFORMANCE_EVENT_DISPATCHER = new InjectionToken<PerformanceEventDispatcher>(
  'PERFORMANCE_EVENT_DISPATCHER'
);
