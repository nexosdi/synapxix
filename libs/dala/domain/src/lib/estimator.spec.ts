import { estimateConstruct } from './estimator';
import { DalaConstructDefinition, EvidenceObservation } from '@nexosdi.synapxix/dala/contracts';

describe('Estimator', () => {
  const mockDefinition: DalaConstructDefinition = {
    constructId: 'curricular_mastery',
    name: 'Mastery',
    halfLifeDays: 30,
    operationalDefinition: 'test',
    evidenceEventTypes: [],
    excludedEventTypes: [],
    invalidationConditions: [],
    minimumEvidence: { observations: 3, distinctTasks: 2, distinctSessions: 2 },
  };

  const baseObservation: EvidenceObservation = {
    observationId: 'obs1',
    subjectId: 'user1',
    sessionId: 'session1',
    sourceEventId: 'evt1',
    ruleId: 'r1',
    ruleVersion: '1.0',
    constructId: 'curricular_mastery',
    kind: 'observed',
    weight: 1,
    confidenceContribution: 0.1,
    observedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  it('should return insufficient_evidence if minimum criteria are not met', () => {
    const result = estimateConstruct({
      subjectId: 'user1',
      definition: mockDefinition,
      observations: [baseObservation],
      distinctTasks: 1,
      distinctSessions: 1,
    });
    expect(result.status).toBe('insufficient_evidence');
  });

  it('should return provisional if distinctSessions >= 2 but confidence is low', () => {
    const obs = Array.from({ length: 3 }).map((_, i) => ({
      ...baseObservation,
      observationId: `obs${i}`,
      confidenceContribution: 0.01,
      observedAt: new Date(Date.now() - i * 1000).toISOString(),
    }));

    const result = estimateConstruct({
      subjectId: 'user1',
      definition: mockDefinition,
      observations: obs,
      distinctTasks: 2,
      distinctSessions: 2,
    });
    expect(result.status).toBe('provisional');
  });

  it('should return supported if criteria met and stability is good', () => {
    const obs = Array.from({ length: 4 }).map((_, i) => ({
      ...baseObservation,
      observationId: `obs${i}`,
      weight: 1,
      confidenceContribution: 0.2,
      observedAt: new Date(Date.now() - i * 1000).toISOString(),
    }));

    const result = estimateConstruct({
      subjectId: 'user1',
      definition: mockDefinition,
      observations: obs,
      distinctTasks: 3,
      distinctSessions: 3,
    });
    expect(result.status).toBe('supported');
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('should return contradicted if stability is low', () => {
    const now = Date.now();
    const obs: EvidenceObservation[] = [
      { ...baseObservation, weight: 1, observedAt: new Date(now - 10000).toISOString() },
      { ...baseObservation, weight: 1, observedAt: new Date(now - 9000).toISOString() },
      { ...baseObservation, weight: -1, observedAt: new Date(now - 1000).toISOString() },
      { ...baseObservation, weight: -1, observedAt: new Date(now).toISOString() },
    ];

    const result = estimateConstruct({
      subjectId: 'user1',
      definition: mockDefinition,
      observations: obs,
      distinctTasks: 2,
      distinctSessions: 2,
    });
    expect(result.status).toBe('contradicted');
  });
});
