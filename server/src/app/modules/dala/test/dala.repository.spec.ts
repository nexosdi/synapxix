import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { DalaRepository } from '../dala.repository';
import {
  makeEvent,
  SUBJECT_ID,
  SESSION_ID,
  EVENT_ID,
  DECISION_ID,
  mockDecision,
  mockSnapshot,
} from './dala.fixtures';

// ── Mock de Prisma ────────────────────────────────────────────────────────────

const mockPrisma = {
  dalaBehaviorEvent: {
    findUnique:  jest.fn(),
    create:      jest.fn(),
    findMany:    jest.fn(),
  },
  dalaEvidenceObservation: {
    createMany:  jest.fn(),
    findMany:    jest.fn(),
  },
  dalaConstructEstimate: {
    upsert:      jest.fn(),
    findMany:    jest.fn(),
  },
  dalaSubjectMap: {
    upsert:      jest.fn(),
  },
  dalaHumanStateSnapshot: {
    create:      jest.fn(),
    findFirst:   jest.fn(),
    findUnique:  jest.fn(),
  },
  dalaDecisionRecord: {
    create:      jest.fn(),
    findUnique:  jest.fn(),
    update:      jest.fn(),
  },
  dalaOutcome: {
    create:      jest.fn(),
    findMany:    jest.fn(),
  },
};

describe('DalaRepository', () => {
  let repository: DalaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DalaRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<DalaRepository>(DalaRepository);
    jest.clearAllMocks();
  });

  // ── appendEvent ────────────────────────────────────────────────────────────

  describe('appendEvent', () => {
    it('should return "accepted" and call create for a new eventId', async () => {
      mockPrisma.dalaBehaviorEvent.findUnique.mockResolvedValue(null);
      mockPrisma.dalaBehaviorEvent.create.mockResolvedValue({});

      const result = await repository.appendEvent(makeEvent());

      expect(result).toBe('accepted');
      expect(mockPrisma.dalaBehaviorEvent.create).toHaveBeenCalledTimes(1);
    });

    it('should return "duplicate" and NOT call create when eventId already exists (idempotency)', async () => {
      mockPrisma.dalaBehaviorEvent.findUnique.mockResolvedValue({ id: 'existing-row-id' });

      const result = await repository.appendEvent(makeEvent());

      expect(result).toBe('duplicate');
      expect(mockPrisma.dalaBehaviorEvent.create).not.toHaveBeenCalled();
    });

    it('should persist the correct fields when creating', async () => {
      mockPrisma.dalaBehaviorEvent.findUnique.mockResolvedValue(null);
      mockPrisma.dalaBehaviorEvent.create.mockResolvedValue({});

      const event = makeEvent();
      await repository.appendEvent(event);

      expect(mockPrisma.dalaBehaviorEvent.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          event_id:           EVENT_ID,
          subject_id:         SUBJECT_ID,
          session_id:         SESSION_ID,
          event_type:         'task_completed',
          sequence:           0,
          instrument_id:      'memory-match',
          instrument_version: '1.0.0',
          consent_scope:      'consent-v1',
          research_allowed:   true,
        }),
      });
    });
  });

  // ── sessionEvents ──────────────────────────────────────────────────────────

  describe('sessionEvents', () => {
    it('should return events mapped to DalaBehaviorEvent shape', async () => {
      mockPrisma.dalaBehaviorEvent.findMany.mockResolvedValue([
        {
          event_id:           EVENT_ID,
          subject_id:         SUBJECT_ID,
          session_id:         SESSION_ID,
          occurred_at:        new Date('2026-09-14T20:00:00Z'),
          sequence:           0,
          event_type:         'task_completed',
          instrument_id:      'memory-match',
          instrument_version: '1.0.0',
          context_json:       { taskId: 'task-001' },
          payload_json:       { score: 100 },
          consent_scope:      'consent-v1',
          research_allowed:   true,
        },
      ]);

      const events = await repository.sessionEvents(SESSION_ID);

      expect(events).toHaveLength(1);
      expect(events[0].eventId).toBe(EVENT_ID);
      expect(events[0].schemaVersion).toBe('dala.behavior-event.v1');
    });

    it('should return empty array when session has no events', async () => {
      mockPrisma.dalaBehaviorEvent.findMany.mockResolvedValue([]);

      const events = await repository.sessionEvents('nonexistent-session');

      expect(events).toEqual([]);
    });
  });

  // ── saveObservations ───────────────────────────────────────────────────────

  describe('saveObservations', () => {
    it('should call createMany with mapped fields', async () => {
      mockPrisma.dalaEvidenceObservation.createMany.mockResolvedValue({ count: 1 });

      await repository.saveObservations([
        {
          subjectId:             SUBJECT_ID,
          sessionId:             SESSION_ID,
          sourceEventId:         EVENT_ID,
          ruleId:                'rule-01',
          ruleVersion:           '1.0',
          constructId:           'memory_working',
          kind:                  'positive',
          weight:                0.8,
          confidenceContribution: 0.4,
          observedAt:            '2026-09-14T20:00:00.000Z',
        },
      ]);

      expect(mockPrisma.dalaEvidenceObservation.createMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              subject_id:   SUBJECT_ID,
              construct_id: 'memory_working',
              weight:       0.8,
            }),
          ]),
        }),
      );
    });

    it('should be a no-op when observations array is empty', async () => {
      await repository.saveObservations([]);

      expect(mockPrisma.dalaEvidenceObservation.createMany).not.toHaveBeenCalled();
    });
  });

  // ── upsertEstimate ─────────────────────────────────────────────────────────

  describe('upsertEstimate', () => {
    it('should call prisma.upsert with correct where clause', async () => {
      mockPrisma.dalaConstructEstimate.upsert.mockResolvedValue({});

      await repository.upsertEstimate({
        subjectId:     SUBJECT_ID,
        constructId:   'memory_working',
        value:         0.7,
        confidence:    0.8,
        stability:     0.6,
        status:        'stable',
        uncertainty:   {},
        evidenceCount: 5,
        evidenceRefs:  ['obs-001'],
        modelVersion:  '1.0.0',
      });

      expect(mockPrisma.dalaConstructEstimate.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            subject_id_construct_id: {
              subject_id:   SUBJECT_ID,
              construct_id: 'memory_working',
            },
          },
        }),
      );
    });
  });

  // ── resolveSubject ─────────────────────────────────────────────────────────

  describe('resolveSubject', () => {
    it('should upsert and return the subject_id', async () => {
      mockPrisma.dalaSubjectMap.upsert.mockResolvedValue({ subject_id: SUBJECT_ID, user_id: 'user-123' });

      const result = await repository.resolveSubject('user-123');

      expect(result).toBe(SUBJECT_ID);
      expect(mockPrisma.dalaSubjectMap.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'user-123' } }),
      );
    });
  });

  // ── saveSnapshot ───────────────────────────────────────────────────────────

  describe('saveSnapshot', () => {
    it('should call prisma.create with mapped fields and return the row', async () => {
      mockPrisma.dalaHumanStateSnapshot.create.mockResolvedValue(mockSnapshot);

      const result = await repository.saveSnapshot({
        subjectId:       SUBJECT_ID,
        state:           { constructs: {} },
        sourceEventFrom: 'evt-first',
        sourceEventTo:   'evt-last',
        modelVersion:    '1.0.0',
      });

      expect(result).toEqual(mockSnapshot);
      expect(mockPrisma.dalaHumanStateSnapshot.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subject_id:        SUBJECT_ID,
            source_event_from: 'evt-first',
            source_event_to:   'evt-last',
          }),
        }),
      );
    });
  });

  // ── getDecision ────────────────────────────────────────────────────────────

  describe('getDecision', () => {
    it('should return the decision when it exists', async () => {
      mockPrisma.dalaDecisionRecord.findUnique.mockResolvedValue(mockDecision);

      const result = await repository.getDecision(DECISION_ID);

      expect(result).toEqual(mockDecision);
    });

    it('should return null when decisionId does not exist', async () => {
      mockPrisma.dalaDecisionRecord.findUnique.mockResolvedValue(null);

      const result = await repository.getDecision('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  // ── reviewDecision ─────────────────────────────────────────────────────────

  describe('reviewDecision', () => {
    it('should update human_verdict and human_verdict_reason', async () => {
      const reviewed = { ...mockDecision, human_verdict: 'approved', human_verdict_reason: 'ok' };
      mockPrisma.dalaDecisionRecord.update.mockResolvedValue(reviewed);

      const result = await repository.reviewDecision(DECISION_ID, 'approved', 'ok');

      expect(result).toEqual(reviewed);
      expect(mockPrisma.dalaDecisionRecord.update).toHaveBeenCalledWith({
        where: { decision_id: DECISION_ID },
        data:  { human_verdict: 'approved', human_verdict_reason: 'ok' },
      });
    });

    it('should set human_verdict_reason to null when no reason is provided', async () => {
      mockPrisma.dalaDecisionRecord.update.mockResolvedValue(mockDecision);

      await repository.reviewDecision(DECISION_ID, 'rejected');

      expect(mockPrisma.dalaDecisionRecord.update).toHaveBeenCalledWith({
        where: { decision_id: DECISION_ID },
        data:  { human_verdict: 'rejected', human_verdict_reason: null },
      });
    });
  });

  // ── outcomesFor ────────────────────────────────────────────────────────────

  describe('outcomesFor', () => {
    it('should return outcomes for a given decisionId', async () => {
      const outcomes = [{ outcome_id: 'out-001', decision_id: DECISION_ID }];
      mockPrisma.dalaOutcome.findMany.mockResolvedValue(outcomes);

      const result = await repository.outcomesFor(DECISION_ID);

      expect(result).toEqual(outcomes);
      expect(mockPrisma.dalaOutcome.findMany).toHaveBeenCalledWith({
        where: { decision_id: DECISION_ID },
      });
    });
  });

  // ── timeline ───────────────────────────────────────────────────────────────

  describe('timeline', () => {
    it('should query by subject_id ordered by occurred_at desc with default limit 200', async () => {
      mockPrisma.dalaBehaviorEvent.findMany.mockResolvedValue([]);

      await repository.timeline(SUBJECT_ID);

      expect(mockPrisma.dalaBehaviorEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { subject_id: SUBJECT_ID },
          orderBy: { occurred_at: 'desc' },
          take: 200,
        }),
      );
    });

    it('should respect a custom limit', async () => {
      mockPrisma.dalaBehaviorEvent.findMany.mockResolvedValue([]);

      await repository.timeline(SUBJECT_ID, 50);

      expect(mockPrisma.dalaBehaviorEvent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });
});
