import { deriveEvidence, EVIDENCE_RULES_V01 } from './evidence-rules';
import { DalaBehaviorEvent, EvidenceContext } from '@nexosdi.synapxix/dala/contracts';

describe('Evidence Rules', () => {
  const baseContext: EvidenceContext = {
    sessionEvents: [],
  };

  const createEvent = (
    eventType: DalaBehaviorEvent['eventType'],
    payload: any = {},
    rewardCondition?: 'none' | 'xp' | 'credits'
  ): DalaBehaviorEvent => ({
    eventId: 'evt1',
    schemaVersion: 'dala.behavior-event.v1',
    source: {
      applicationId: 'engine',
      instrumentId: 'engine',
      instrumentVersion: '1.0',
    },
    consent: {
      scopeId: 'v1',
      researchAllowed: true,
    },
    subjectId: 'user1',
    sessionId: 'session1',
    sequence: 2,
    occurredAt: new Date().toISOString(),
    eventType,
    payload,
    context: {
      taskId: 'task1',
      difficulty: 1,
      rewardCondition: rewardCondition ?? 'none',
      skillIds: ['s1'],
    },
  });

  describe('masteryFromAnswer', () => {
    it('should emit positive evidence for correct answer without hint', () => {
      const event = createEvent('answer_submitted', { correct: true });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      
      const mastery = evidence.find((e) => e.ruleId === 'mastery-from-answer');
      expect(mastery).toBeDefined();
      expect(mastery?.weight).toBe(1);
    });

    it('should emit negative evidence for incorrect answer', () => {
      const event = createEvent('answer_submitted', { correct: false });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      
      const mastery = evidence.find((e) => e.ruleId === 'mastery-from-answer');
      expect(mastery?.weight).toBe(-0.5);
    });

    it('should ignore correct answer if hint was used', () => {
      const event = createEvent('answer_submitted', { correct: true });
      event.sequence = 3;
      const context = {
        sessionEvents: [
          createEvent('hint_requested', {}, 'none'),
        ],
      };
      
      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'mastery-from-answer')).toBeUndefined();
    });
  });

  describe('persistenceFromRetry', () => {
    it('should emit persistence evidence if prior fail exists', () => {
      const event = createEvent('attempt_repeated', { attempt: 2 });
      const context = {
        sessionEvents: [
          createEvent('answer_submitted', { correct: false }, 'none'),
        ],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      const persistence = evidence.find((e) => e.ruleId === 'persistence-from-retry');
      expect(persistence?.weight).toBe(1);
    });

    it('should emit negative persistence if attempts > 5', () => {
      const event = createEvent('attempt_repeated', { attempt: 6 });
      const context = {
        sessionEvents: [
          createEvent('answer_submitted', { correct: false }, 'none'),
        ],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      const persistence = evidence.find((e) => e.ruleId === 'persistence-from-retry');
      expect(persistence?.weight).toBe(-0.3);
    });

    it('should ignore retry if reward condition is active', () => {
      const event = createEvent('attempt_repeated', { attempt: 2 }, 'xp');
      const context = {
        sessionEvents: [
          createEvent('answer_submitted', { correct: false }, 'none'),
        ],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'persistence-from-retry')).toBeUndefined();
    });
  });

  describe('helpSeekingFromHint', () => {
    it('should emit help seeking evidence if tried first', () => {
      const event = createEvent('hint_requested', {});
      event.sequence = 3;
      const context = {
        sessionEvents: [
          createEvent('answer_submitted', { correct: false }, 'none'),
        ],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'help-seeking-from-hint')).toBeDefined();
    });

    it('should ignore if not tried first', () => {
      const event = createEvent('hint_requested', {});
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'help-seeking-from-hint')).toBeUndefined();
    });
  });

  describe('flexibilityFromStrategyChange', () => {
    it('should emit flexibility evidence', () => {
      const event = createEvent('strategy_changed', {});
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'flexibility-from-strategy-change')).toBeDefined();
    });

    it('should ignore if induced by hint recently', () => {
      const event = createEvent('strategy_changed', {});
      event.sequence = 3;
      const context = {
        sessionEvents: [
          { ...createEvent('hint_requested', {}), sequence: 2 },
        ],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'flexibility-from-strategy-change')).toBeUndefined();
    });
  });

  describe('engagementFromCompletion', () => {
    it('should emit positive engagement on completion', () => {
      const event = createEvent('task_completed', {});
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')?.weight).toBe(1);
    });

    it('should emit negative engagement on abandon', () => {
      const event = createEvent('task_abandoned', {});
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')?.weight).toBe(-0.6);
    });

    it('should ignore if reward condition is active', () => {
      const event = createEvent('task_completed', {}, 'credits');
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')).toBeUndefined();
    });
  });
});
