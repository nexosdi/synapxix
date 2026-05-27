import { Injectable } from '@angular/core';
import { PerformanceEvent } from '../models/performance-event.model';
import { PerformanceEventDispatcher } from './performance-event-dispatcher';

/**
 * Development-only dispatcher that pretty-prints performance events
 * to the browser console.
 *
 * Replace with an HttpEventDispatcher when the backend is ready:
 * ```ts
 * { provide: PERFORMANCE_EVENT_DISPATCHER, useClass: HttpEventDispatcher }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConsoleEventDispatcher implements PerformanceEventDispatcher {

  async dispatch(events: PerformanceEvent[]): Promise<void> {
    if (events.length === 0) return;

    console.groupCollapsed(
      `%c📊 Performance Events (${events.length})`,
      'color: #6366f1; font-weight: bold;'
    );

    for (const event of events) {
      console.log(
        `%c[${event.gameType}]%c ${event.contentId}` +
        ` — ⏱ ${event.completionTimeMs.toFixed(0)}ms` +
        ` | ⚡ reaction ${event.reactionTimeMs.toFixed(0)}ms` +
        ` | 🎯 accuracy ${(event.accuracy * 100).toFixed(0)}%` +
        ` | score ${event.score}` +
        ` | ${event.isCorrect ? '✅' : '❌'}`,
        'color: #06b6d4; font-weight: bold;',
        'color: inherit;'
      );
    }

    // Also output as a table for easy copy-paste / inspection
    console.table(
      events.map(e => ({
        game: e.gameType,
        content: e.contentId,
        completionMs: Math.round(e.completionTimeMs),
        reactionMs: Math.round(e.reactionTimeMs),
        accuracy: `${(e.accuracy * 100).toFixed(0)}%`,
        score: e.score,
        correct: e.isCorrect,
        attempt: e.attemptNumber,
      }))
    );

    console.groupEnd();
  }
}
