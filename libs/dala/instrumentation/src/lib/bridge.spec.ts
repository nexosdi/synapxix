import { validateEventV2, type DalaEventV2 } from '@nexosdi.synapxix/dala/contracts';
import { DalaBridge, MAX_BATCH } from './bridge';

const makeBridge = (send: (e: DalaEventV2[]) => Promise<string[]>) => {
  let id = 0;
  return new DalaBridge({
    applicationId: 'test',
    subjectId: 'subj-1',
    sessionId: 'ses-1',
    frameworkVersion: 'pulso-web@0.1',
    consent: { scopeId: 'c1', researchAllowed: true },
    transport: { send },
    idFactory: () => `ev-${++id}`,
    now: () => new Date('2026-10-26T15:00:00Z'),
  });
};

describe('puente D.A.L.A. v2', () => {
  it('produce eventos v2 válidos con escena, oportunidad y secuencia', async () => {
    const sent: DalaEventV2[] = [];
    const bridge = makeBridge(async (events) => {
      sent.push(...events);
      return events.map((e) => e.eventId);
    });
    bridge.startSession({ id: 'portal', version: '0.1' });
    bridge.enterScene({ id: 'observatorio', version: '0.1' });
    bridge.observe({ type: 'task_presented', opportunity: { id: 'observatorio:c1', kind: 'tarea' } });
    bridge.observe({ type: 'response_submitted', opportunity: { id: 'observatorio:c1', kind: 'tarea' }, payload: { correct: true } });
    await bridge.flush();

    expect(sent.map((e) => e.sequence)).toEqual([1, 2, 3, 4]);
    expect(sent.every((e) => validateEventV2(e) === null)).toBe(true);
    expect(sent[2].scene).toEqual({ id: 'observatorio', version: '0.1' });
    expect(sent[3].opportunity?.id).toBe('observatorio:c1');
    expect(bridge.pendingCount).toBe(0);
  });

  it('rechaza localmente una acción sin oportunidad y no consume secuencia', () => {
    const bridge = makeBridge(async () => []);
    bridge.startSession({ id: 'portal', version: '0.1' });
    expect(bridge.observe({ type: 'response_submitted' })).toBeNull();
    expect(bridge.rejected[0].reason).toBe('missing_opportunity');
    const next = bridge.observe({ type: 'hint_requested', opportunity: { id: 'x', kind: 'tarea' } });
    expect(next?.sequence).toBe(2);
  });

  it('sin red conserva la cola y reenvía después', async () => {
    let online = false;
    const bridge = makeBridge(async (events) => {
      if (!online) throw new Error('offline');
      return events.map((e) => e.eventId);
    });
    bridge.startSession({ id: 'portal', version: '0.1' });
    expect((await bridge.flush()).pending).toBe(1);
    online = true;
    expect(await bridge.flush()).toEqual({ sent: 1, pending: 0 });
  });

  it('envía en lotes acotados y serializa flushes concurrentes sin duplicar', async () => {
    const batches: number[] = [];
    const seen = new Set<string>();
    let duplicates = 0;
    const bridge = makeBridge(async (events) => {
      batches.push(events.length);
      for (const e of events) {
        if (seen.has(e.eventId)) duplicates += 1;
        seen.add(e.eventId);
      }
      await new Promise((r) => setTimeout(r, 5));
      return events.map((e) => e.eventId);
    });
    bridge.startSession({ id: 'portal', version: '0.1' });
    for (let i = 0; i < 230; i++) {
      bridge.observe({ type: 'task_presented', opportunity: { id: `portal:t${i}`, kind: 'tarea' } });
    }
    await Promise.all([bridge.flush(), bridge.flush()]);

    expect(Math.max(...batches)).toBeLessThanOrEqual(MAX_BATCH);
    expect(seen.size).toBe(231);
    expect(duplicates).toBe(0);
    expect(bridge.pendingCount).toBe(0);
  });
});
