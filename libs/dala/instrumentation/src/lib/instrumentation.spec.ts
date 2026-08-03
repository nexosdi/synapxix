/**
 * Pruebas contractuales de instrumentación (directrices §5): cada instrumento
 * debe emitir los eventos esperados, en orden, con envelope válido, y el SDK
 * debe tolerar offline sin perder ni duplicar.
 */
import type { DalaBehaviorEvent } from '@nexosdi.synapxix/dala/contracts';
import { DalaEmitter, type EmitterTransport } from './emitter';
import { GameInstrumentAdapter } from './adapters';

const makeEmitter = (transport: EmitterTransport) => {
  let n = 0;
  return new DalaEmitter({
    applicationId: 'synapxix-web-game',
    subjectId: 'subj-1',
    sessionId: 'ses-1',
    consent: { scopeId: 'cp-1', researchAllowed: true },
    transport,
    idFactory: () => `id-${++n}`,
    now: () => new Date('2026-08-03T10:00:00Z'),
  });
};

const okTransport = (received: DalaBehaviorEvent[][]): EmitterTransport => ({
  send: async (events) => {
    received.push(events);
    return events.map((e) => e.eventId);
  },
});

describe.each(['categorization', 'timeline-order', 'intruder'] as const)(
  'adaptador %s',
  (instrumentId) => {
    it('emite la secuencia completa esperada, en orden y con envelope válido', () => {
      const emitter = makeEmitter(okTransport([]));
      const adapter = new GameInstrumentAdapter(instrumentId, '1.0.0', emitter);

      const flow = [
        adapter.mapInteraction({ kind: 'task_shown', taskId: 't1', skillIds: ['s1'], difficulty: 0.4 }),
        adapter.mapInteraction({ kind: 'answer', taskId: 't1', correct: false, attempt: 1 }),
        adapter.mapInteraction({ kind: 'retry', taskId: 't1', attempt: 2 }),
        adapter.mapInteraction({ kind: 'hint', taskId: 't1', level: 1 }),
        adapter.mapInteraction({ kind: 'strategy_shift', taskId: 't1', from: 'a', to: 'b' }),
        adapter.mapInteraction({ kind: 'answer', taskId: 't1', correct: true, attempt: 3 }),
        adapter.mapInteraction({ kind: 'complete', taskId: 't1' }),
      ];

      expect(flow.map((e) => e.eventType)).toEqual([
        'task_presented',
        'answer_submitted',
        'attempt_repeated',
        'hint_requested',
        'strategy_changed',
        'answer_submitted',
        'task_completed',
      ]);
      // secuencia estrictamente incremental
      expect(flow.map((e) => e.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      // envelope: versión, instrumento versionado y consentimiento presentes
      for (const e of flow) {
        expect(e.schemaVersion).toBe('dala.behavior-event.v1');
        expect(e.source.instrumentId).toBe(instrumentId);
        expect(e.source.instrumentVersion).toBe('1.0.0');
        expect(e.consent.scopeId).toBe('cp-1');
        expect(e.context.taskId).toBe('t1');
      }
    });
  },
);

describe('SDK — tolerancia offline', () => {
  it('flush drena la cola y conserva lo no confirmado', async () => {
    const batches: DalaBehaviorEvent[][] = [];
    const emitter = makeEmitter(okTransport(batches));
    const adapter = new GameInstrumentAdapter('intruder', '1.0.0', emitter);
    adapter.mapInteraction({ kind: 'task_shown', taskId: 't1' });
    adapter.mapInteraction({ kind: 'complete', taskId: 't1' });

    const result = await emitter.flush();
    expect(result).toEqual({ sent: 2, pending: 0 });
    expect(batches[0]).toHaveLength(2);
  });

  it('sin red los eventos permanecen encolados; con red se reenvían sin perderse', async () => {
    let online = false;
    const emitter = makeEmitter({
      send: async (events) => {
        if (!online) throw new Error('offline');
        return events.map((e) => e.eventId);
      },
    });
    const adapter = new GameInstrumentAdapter('categorization', '1.0.0', emitter);
    adapter.mapInteraction({ kind: 'task_shown', taskId: 't1' });
    adapter.mapInteraction({ kind: 'answer', taskId: 't1', correct: true });

    expect(await emitter.flush()).toEqual({ sent: 0, pending: 2 });
    online = true;
    expect(await emitter.flush()).toEqual({ sent: 2, pending: 0 });
    expect(emitter.pendingCount).toBe(0);
  });
});
