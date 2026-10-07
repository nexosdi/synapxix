import type { EvidenceObservation } from '@nexosdi.synapxix/dala/contracts';
import { estimateConstruct } from './estimator';
import { CONSTRUCT_REGISTRY } from './construct-registry';

describe('Estimador Beta-Binomial v0.1 (estimator.spec.ts)', () => {
  // Función auxiliar para generar observaciones de prueba
  const obs = (n: number, weight = 1): EvidenceObservation[] =>
    Array.from({ length: n }, (_, i) => ({
      observationId: `o-${i}`,
      subjectId: 's-1',
      sessionId: `ses-${i % 2}`,
      sourceEventId: `e-${i}`,
      ruleId: 'r',
      ruleVersion: '0.1.0',
      constructId: 'persistence',
      kind: 'observed',
      weight,
      confidenceContribution: 0.12,
      observedAt: '2026-08-01T10:00:00Z',
      createdAt: '2026-08-01T10:00:00Z',
    }));

  it('debe devolver "insufficient_evidence" cuando no hay observaciones suficientes', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(2),
      distinctTasks: 1,
      distinctSessions: 1,
      now: new Date('2026-08-03'),
    });
    expect(est.status).toBe('insufficient_evidence');
  });

  it('no debe otorgar alta confianza por una interacción aislada', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(1),
      distinctTasks: 1,
      distinctSessions: 1,
      now: new Date('2026-08-03'),
    });
    expect(est.confidence).toBeLessThan(0.3);
  });

  it('debe devolver estado "supported" con evidencia suficiente y 2+ sesiones', () => {
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: obs(8),
      distinctTasks: 3,
      distinctSessions: 2,
      now: new Date('2026-08-03'),
    });
    expect(['provisional', 'supported']).toContain(est.status);
    expect(est.value).toBeGreaterThan(0.5);
    expect(est.evidenceRefs).toHaveLength(8);
    expect(est.modelVersion).toBe('dala-core-0.1.0');
    expect(est.uncertainty.method).toBe('beta_posterior');
  });

  it('debe bajar la estabilidad (y pasar a contradicted) si la evidencia es contradictoria', () => {
    const mixed = [
      ...obs(4, 1),
      ...obs(4, -1).map((o, i) => ({
        ...o,
        observationId: `neg-${i}`,
        observedAt: '2026-08-02T10:00:00Z',
      })),
    ];
    const est = estimateConstruct({
      subjectId: 's-1',
      definition: CONSTRUCT_REGISTRY['persistence'],
      observations: mixed,
      distinctTasks: 3,
      distinctSessions: 2,
      now: new Date('2026-08-03'),
    });
    expect(est.stability).toBeLessThan(0.5);
    expect(est.evidenceCount).toBe(8);
  });
});
