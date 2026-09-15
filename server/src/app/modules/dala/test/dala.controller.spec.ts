import { Test, TestingModule } from '@nestjs/testing';
import { DalaController } from '../dala.controller';
import { DalaFacade } from '../dala.facade';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import {
  makeEvent,
  SUBJECT_ID,
  EVENT_ID,
  DECISION_ID,
  mockDecision,
} from './dala.fixtures';

// ── Mock de la fachada ────────────────────────────────────────────────────────

const mockFacade = {
  ingest:         jest.fn(),
  ingestBatch:    jest.fn(),
  getState:       jest.fn(),
  getTimeline:    jest.fn(),
  resolveSubject: jest.fn(),
  decide:         jest.fn(),
  getTrace:       jest.fn(),
  review:         jest.fn(),
  recordOutcome:  jest.fn(),
};

describe('DalaController', () => {
  let controller: DalaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          { name: 'short',  ttl: 1000,  limit: 50  },
          { name: 'medium', ttl: 10000, limit: 400 },
        ]),
      ],
      controllers: [DalaController],
      providers: [
        { provide: DalaFacade, useValue: mockFacade },
      ],
    })
      // Saltamos el guard JWT en tests unitarios del controlador
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DalaController>(DalaController);
    jest.clearAllMocks();
  });

  // ── ingest ─────────────────────────────────────────────────────────────────

  describe('POST /dala/v1/events (ingest)', () => {
    it('should delegate to facade.ingest and return the result', async () => {
      const expected = { eventId: EVENT_ID, status: 'accepted' };
      mockFacade.ingest.mockResolvedValue(expected);

      const result = await controller.ingest(makeEvent());

      expect(mockFacade.ingest).toHaveBeenCalledWith(expect.objectContaining({ eventId: EVENT_ID }));
      expect(result).toEqual(expected);
    });

    it('should return duplicate status when facade signals duplicate', async () => {
      mockFacade.ingest.mockResolvedValue({ eventId: EVENT_ID, status: 'duplicate' });

      const result = await controller.ingest(makeEvent());

      expect(result.status).toBe('duplicate');
    });

    it('should return quarantined when facade signals missing consent', async () => {
      mockFacade.ingest.mockResolvedValue({
        eventId: EVENT_ID,
        status: 'quarantined',
        reason: 'missing_consent_scope',
      });

      const result = await controller.ingest(makeEvent());

      expect(result.status).toBe('quarantined');
    });
  });

  // ── ingestBatch ────────────────────────────────────────────────────────────

  describe('POST /dala/v1/events/batch (ingestBatch)', () => {
    it('should delegate to facade.ingestBatch and return results', async () => {
      const results = [
        { eventId: 'evt-001', status: 'accepted' },
        { eventId: 'evt-002', status: 'duplicate' },
      ];
      mockFacade.ingestBatch.mockResolvedValue(results);

      const response = await controller.ingestBatch({
        events: [makeEvent({ eventId: 'evt-001' }), makeEvent({ eventId: 'evt-002' })],
      });

      expect(mockFacade.ingestBatch).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ eventId: 'evt-001' }),
          expect.objectContaining({ eventId: 'evt-002' }),
        ]),
      );
      expect(response).toEqual(results);
    });

    it('should call facade.ingestBatch with empty array when body.events is undefined', async () => {
      mockFacade.ingestBatch.mockResolvedValue([]);

      await controller.ingestBatch({} as never);

      expect(mockFacade.ingestBatch).toHaveBeenCalledWith([]);
    });
  });

  // ── getState ───────────────────────────────────────────────────────────────

  describe('GET /dala/v1/subjects/:subjectId/state', () => {
    it('should delegate to facade.getState', async () => {
      const state = { subjectId: SUBJECT_ID, updatedAt: new Date().toISOString(), constructs: {} };
      mockFacade.getState.mockResolvedValue(state);

      const result = await controller.getState(SUBJECT_ID);

      expect(mockFacade.getState).toHaveBeenCalledWith(SUBJECT_ID);
      expect(result).toEqual(state);
    });
  });

  // ── getTimeline ────────────────────────────────────────────────────────────

  describe('GET /dala/v1/subjects/:subjectId/timeline', () => {
    it('should delegate to facade.getTimeline', async () => {
      const timeline = [{ event_id: EVENT_ID }];
      mockFacade.getTimeline.mockResolvedValue(timeline);

      const result = await controller.getTimeline(SUBJECT_ID);

      expect(mockFacade.getTimeline).toHaveBeenCalledWith(SUBJECT_ID);
      expect(result).toEqual(timeline);
    });
  });

  // ── resolveSubject ─────────────────────────────────────────────────────────

  describe('POST /dala/v1/subjects/resolve', () => {
    it('should pass req.user.sub to facade.resolveSubject', async () => {
      mockFacade.resolveSubject.mockResolvedValue({ subjectId: SUBJECT_ID });

      const fakeReq = { user: { sub: 'keycloak-user-id' } } as never;
      const result  = await controller.resolveSubject(fakeReq);

      expect(mockFacade.resolveSubject).toHaveBeenCalledWith('keycloak-user-id');
      expect(result).toEqual({ subjectId: SUBJECT_ID });
    });
  });

  // ── decide ─────────────────────────────────────────────────────────────────

  describe('POST /dala/v1/decisions', () => {
    it('should delegate to facade.decide with the subjectId', async () => {
      mockFacade.decide.mockResolvedValue(mockDecision);

      const result = await controller.decide({ subjectId: SUBJECT_ID });

      expect(mockFacade.decide).toHaveBeenCalledWith(SUBJECT_ID);
      expect(result).toEqual(mockDecision);
    });
  });

  // ── getDecision ────────────────────────────────────────────────────────────

  describe('GET /dala/v1/decisions/:decisionId', () => {
    it('should return decision from facade.getTrace', async () => {
      mockFacade.getTrace.mockResolvedValue({ decision: mockDecision });

      const result = await controller.getDecision(DECISION_ID);

      expect(mockFacade.getTrace).toHaveBeenCalledWith(DECISION_ID);
      expect(result).toEqual(mockDecision);
    });
  });

  // ── review ─────────────────────────────────────────────────────────────────

  describe('POST /dala/v1/decisions/:decisionId/review', () => {
    it('should delegate verdict and reason to facade.review', async () => {
      const reviewed = { ...mockDecision, human_verdict: 'approved' };
      mockFacade.review.mockResolvedValue(reviewed);

      const result = await controller.review(DECISION_ID, { verdict: 'approved', reason: 'ok' });

      expect(mockFacade.review).toHaveBeenCalledWith(DECISION_ID, 'approved', 'ok');
      expect(result).toEqual(reviewed);
    });
  });

  // ── recordOutcome ──────────────────────────────────────────────────────────

  describe('POST /dala/v1/outcomes', () => {
    it('should delegate to facade.recordOutcome', async () => {
      const outcomeResult = { outcomeId: 'out-001', expected: null, observed: {}, metricMatched: null };
      mockFacade.recordOutcome.mockResolvedValue(outcomeResult);

      const result = await controller.recordOutcome({
        decisionId:     DECISION_ID,
        interventionId: 'intv-001',
        metrics:        { score: 0.9 },
      });

      expect(mockFacade.recordOutcome).toHaveBeenCalledWith(
        expect.objectContaining({ decisionId: DECISION_ID }),
      );
      expect(result).toEqual(outcomeResult);
    });
  });

  // ── getTrace ───────────────────────────────────────────────────────────────

  describe('GET /dala/v1/traces/:decisionId', () => {
    it('should return the full trace from facade.getTrace', async () => {
      const trace = { decision: mockDecision, stateSnapshot: {}, evidence: [], outcomes: [] };
      mockFacade.getTrace.mockResolvedValue(trace);

      const result = await controller.getTrace(DECISION_ID);

      expect(mockFacade.getTrace).toHaveBeenCalledWith(DECISION_ID);
      expect(result).toEqual(trace);
    });
  });
});
