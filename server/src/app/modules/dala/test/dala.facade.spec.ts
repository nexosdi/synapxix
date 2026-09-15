import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DalaFacade } from '../dala.facade';
import { DalaRepository } from '../dala.repository';
import {
  makeEvent,
  SUBJECT_ID,
  EVENT_ID,
  DECISION_ID,
  mockDecision,
  mockSnapshot,
} from './dala.fixtures';

// ── Mock del repositorio ──────────────────────────────────────────────────────

const mockRepository = {
  appendEvent:         jest.fn(),
  sessionEvents:       jest.fn(),
  saveObservations:    jest.fn(),
  observationsFor:     jest.fn(),
  evidenceDiversity:   jest.fn(),
  upsertEstimate:      jest.fn(),
  estimatesFor:        jest.fn(),
  timeline:            jest.fn(),
  resolveSubject:      jest.fn(),
  saveSnapshot:        jest.fn(),
  saveDecision:        jest.fn(),
  getDecision:         jest.fn(),
  reviewDecision:      jest.fn(),
  saveOutcome:         jest.fn(),
  outcomesFor:         jest.fn(),
  getSnapshot:         jest.fn(),
  observationsBySubject: jest.fn(),
};

describe('DalaFacade', () => {
  let facade: DalaFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DalaFacade,
        { provide: DalaRepository, useValue: mockRepository },
      ],
    }).compile();

    facade = module.get<DalaFacade>(DalaFacade);
    jest.clearAllMocks();
  });

  // ── ingest ─────────────────────────────────────────────────────────────────

  describe('ingest', () => {
    it('should return accepted for a valid new event (happy path)', async () => {
      mockRepository.appendEvent.mockResolvedValue('accepted');
      mockRepository.sessionEvents.mockResolvedValue([]);
      mockRepository.saveObservations.mockResolvedValue(undefined);

      const result = await facade.ingest(makeEvent());

      expect(mockRepository.appendEvent).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ eventId: EVENT_ID, status: 'accepted' });
    });

    it('should return duplicate when the same eventId is sent twice', async () => {
      mockRepository.appendEvent.mockResolvedValue('duplicate');

      const result = await facade.ingest(makeEvent());

      expect(result).toEqual({ eventId: EVENT_ID, status: 'duplicate' });
      // processEvidence no debe ejecutarse en duplicados
      expect(mockRepository.sessionEvents).not.toHaveBeenCalled();
    });

    it('should return quarantined when consent.scopeId is missing', async () => {
      const event = makeEvent({ consent: { scopeId: '', researchAllowed: true } });

      const result = await facade.ingest(event);

      expect(result.status).toBe('quarantined');
      expect(result.reason).toBe('missing_consent_scope');
      expect(mockRepository.appendEvent).not.toHaveBeenCalled();
    });

    it('should return rejected when schemaVersion is wrong', async () => {
      const event = makeEvent({ schemaVersion: 'dala.behavior-event.v0' as never });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('unsupported_schema_version');
    });

    it('should return rejected when eventId is missing', async () => {
      const event = makeEvent({ eventId: '' });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('missing_event_id');
    });

    it('should return rejected when subjectId is missing', async () => {
      const event = makeEvent({ subjectId: '' });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('missing_subject_id');
    });

    it('should return rejected when sessionId is missing', async () => {
      const event = makeEvent({ sessionId: '' });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('missing_session_id');
    });

    it('should return rejected when sequence is negative', async () => {
      const event = makeEvent({ sequence: -1 });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('invalid_sequence');
    });

    it('should return rejected when eventType is unknown', async () => {
      const event = makeEvent({ eventType: 'unknown_type' as never });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('unknown_event_type');
    });

    it('should return rejected when source.instrumentId is missing', async () => {
      const event = makeEvent({
        source: { applicationId: 'app', instrumentId: '', instrumentVersion: '1.0.0' },
      });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('missing_instrument_version');
    });

    it('should return rejected when occurredAt is not a valid date', async () => {
      const event = makeEvent({ occurredAt: 'not-a-date' });

      const result = await facade.ingest(event);

      expect(result.status).toBe('rejected');
      expect(result.reason).toBe('invalid_occurred_at');
    });

    it('should still return accepted even when evidence processing throws (post-ACK isolation)', async () => {
      mockRepository.appendEvent.mockResolvedValue('accepted');
      // sessionEvents falla → processEvidence explota, pero el ACK ya salió
      mockRepository.sessionEvents.mockRejectedValue(new Error('db down'));

      const result = await facade.ingest(makeEvent());

      expect(result).toEqual({ eventId: EVENT_ID, status: 'accepted' });
    });
  });

  // ── ingestBatch ────────────────────────────────────────────────────────────

  describe('ingestBatch', () => {
    it('should process each event independently and return one result per event', async () => {
      mockRepository.appendEvent
        .mockResolvedValueOnce('accepted')
        .mockResolvedValueOnce('duplicate');
      mockRepository.sessionEvents.mockResolvedValue([]);
      mockRepository.saveObservations.mockResolvedValue(undefined);

      const e1 = makeEvent({ eventId: 'evt-001' });
      const e2 = makeEvent({ eventId: 'evt-002' });

      const results = await facade.ingestBatch([e1, e2]);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('accepted');
      expect(results[1].status).toBe('duplicate');
    });

    it('should return empty array when called with no events', async () => {
      const results = await facade.ingestBatch([]);
      expect(results).toEqual([]);
    });
  });

  // ── getState ───────────────────────────────────────────────────────────────

  describe('getState', () => {
    it('should return subjectId and a constructs map', async () => {
      mockRepository.estimatesFor.mockResolvedValue([
        {
          construct_id:   'memory_working',
          value:          0.7,
          confidence:     0.8,
          stability:      0.6,
          status:         'stable',
          uncertainty:    {},
          evidence_count: 5,
          expires_at:     null,
          model_version:  '1.0.0',
        },
      ]);

      const result = await facade.getState(SUBJECT_ID);

      expect(result.subjectId).toBe(SUBJECT_ID);
      expect(result.constructs).toHaveProperty('memory_working');
      expect(result.constructs['memory_working'].value).toBe(0.7);
    });

    it('should return empty constructs when subject has no estimates', async () => {
      mockRepository.estimatesFor.mockResolvedValue([]);

      const result = await facade.getState(SUBJECT_ID);

      expect(result.constructs).toEqual({});
    });
  });

  // ── resolveSubject ─────────────────────────────────────────────────────────

  describe('resolveSubject', () => {
    it('should wrap the subject_id in an object', async () => {
      mockRepository.resolveSubject.mockResolvedValue(SUBJECT_ID);

      const result = await facade.resolveSubject('user-123');

      expect(result).toEqual({ subjectId: SUBJECT_ID });
    });
  });

  // ── decide ─────────────────────────────────────────────────────────────────

  describe('decide', () => {
    it('should orchestrate snapshot + decision and return the record (happy path)', async () => {
      mockRepository.estimatesFor.mockResolvedValue([]);
      mockRepository.timeline.mockResolvedValue([
        { event_id: 'evt-first' },
        { event_id: 'evt-last' },
      ]);
      mockRepository.saveSnapshot.mockResolvedValue(mockSnapshot);
      mockRepository.saveDecision.mockResolvedValue(mockDecision);

      const result = await facade.decide(SUBJECT_ID);

      expect(mockRepository.saveSnapshot).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveDecision).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockDecision);
    });

    it('should use "none" as event range when timeline is empty', async () => {
      mockRepository.estimatesFor.mockResolvedValue([]);
      mockRepository.timeline.mockResolvedValue([]);
      mockRepository.saveSnapshot.mockResolvedValue(mockSnapshot);
      mockRepository.saveDecision.mockResolvedValue(mockDecision);

      await facade.decide(SUBJECT_ID);

      expect(mockRepository.saveSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ sourceEventFrom: 'none', sourceEventTo: 'none' }),
      );
    });
  });

  // ── review ─────────────────────────────────────────────────────────────────

  describe('review', () => {
    it('should call reviewDecision and return the result on a valid decision', async () => {
      const reviewed = { ...mockDecision, human_verdict: 'approved' };
      mockRepository.getDecision.mockResolvedValue(mockDecision);
      mockRepository.reviewDecision.mockResolvedValue(reviewed);

      const result = await facade.review(DECISION_ID, 'approved', 'looks good');

      expect(mockRepository.reviewDecision).toHaveBeenCalledWith(DECISION_ID, 'approved', 'looks good');
      expect(result).toEqual(reviewed);
    });

    it('should throw BadRequestException when decision does not exist', async () => {
      mockRepository.getDecision.mockResolvedValue(null);

      await expect(facade.review('nonexistent-id', 'approved')).rejects.toThrow(BadRequestException);
      expect(mockRepository.reviewDecision).not.toHaveBeenCalled();
    });
  });

  // ── recordOutcome ──────────────────────────────────────────────────────────

  describe('recordOutcome', () => {
    it('should persist outcome and compare observed vs expected metric (happy path)', async () => {
      const outcome = {
        outcome_id: 'out-001',
        decision_id: DECISION_ID,
        subject_id: SUBJECT_ID,
        intervention_id: 'intv-001',
        metrics: { score: 0.9 },
        observed_at: new Date(),
      };
      mockRepository.getDecision.mockResolvedValue(mockDecision);
      mockRepository.saveOutcome.mockResolvedValue(outcome);

      const result = await facade.recordOutcome({
        decisionId: DECISION_ID,
        interventionId: 'intv-001',
        metrics: { score: 0.9 },
      });

      expect(mockRepository.saveOutcome).toHaveBeenCalledTimes(1);
      expect(result.outcomeId).toBe('out-001');
      expect(result.metricMatched).toBe(true); // 'score' está en metrics
    });

    it('should set metricMatched to null when expected_outcome has no metric key', async () => {
      const decisionNoMetric = { ...mockDecision, expected_outcome: {} };
      mockRepository.getDecision.mockResolvedValue(decisionNoMetric);
      mockRepository.saveOutcome.mockResolvedValue({ outcome_id: 'out-002' });

      const result = await facade.recordOutcome({
        decisionId: DECISION_ID,
        interventionId: 'intv-001',
        metrics: { score: 0.9 },
      });

      expect(result.metricMatched).toBeNull();
    });

    it('should throw BadRequestException when decision does not exist', async () => {
      mockRepository.getDecision.mockResolvedValue(null);

      await expect(
        facade.recordOutcome({ decisionId: 'bad-id', interventionId: 'x', metrics: {} }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── getTrace ───────────────────────────────────────────────────────────────

  describe('getTrace', () => {
    it('should assemble a full trace (decision + snapshot + evidence + outcomes)', async () => {
      const obs = [
        {
          observation_id:         'obs-001',
          construct_id:           'memory_working',
          rule_id:                'rule-01',
          rule_version:           '1.0',
          weight:                 0.8,
          source_event_id:        EVENT_ID,
          observed_at:            new Date(),
        },
      ];
      mockRepository.getDecision.mockResolvedValue(mockDecision);
      mockRepository.getSnapshot.mockResolvedValue(mockSnapshot);
      mockRepository.observationsBySubject.mockResolvedValue(obs);
      mockRepository.outcomesFor.mockResolvedValue([]);

      const result = await facade.getTrace(DECISION_ID);

      expect(result.decision).toEqual(mockDecision);
      expect(result.stateSnapshot).toEqual(mockSnapshot);
      expect(result.evidence).toHaveLength(1);
      expect(result.evidence[0].constructId).toBe('memory_working');
      expect(result.outcomes).toEqual([]);
    });

    it('should throw BadRequestException when decisionId is unknown', async () => {
      mockRepository.getDecision.mockResolvedValue(null);

      await expect(facade.getTrace('bad-id')).rejects.toThrow(BadRequestException);
    });
  });
});
