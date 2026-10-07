import { deriveEvidence, EVIDENCE_RULES_V01 } from './evidence-rules';
import type { DalaBehaviorEvent, EvidenceContext } from '@nexosdi.synapxix/dala/contracts';

describe('D.A.L.A. Core - Evidence Rules v0.1 (evidence-rules.spec.ts)', () => {
  const baseContext: EvidenceContext = {
    sessionEvents: [],
  };

  // Combinamos la flexibilidad de tu helper (HEAD) con los requerimientos estrictos de reward (main)
  const ev = (
    partial: Partial<DalaBehaviorEvent>,
    rewardCondition: 'none' | 'xp' | 'credits' = 'none'
  ): DalaBehaviorEvent => ({
    eventId: partial.eventId ?? `e-${Math.random()}`,
    schemaVersion: 'dala.behavior-event.v1',
    subjectId: 's-1',
    sessionId: 'ses-1',
    occurredAt: new Date().toISOString(),
    sequence: 1,
    eventType: 'answer_submitted', 
    source: { applicationId: 'engine', instrumentId: 'engine', instrumentVersion: '1.0.0' },
    context: { taskId: 't-1', difficulty: 1, skillIds: ['s1'], rewardCondition },
    payload: {},
    consent: { scopeId: 'cp-1', researchAllowed: true },
    ...partial,
  });

  describe('masteryFromAnswer', () => {
    it('debería emitir evidencia positiva para respuesta correcta sin pistas', () => {
      const event = ev({ eventType: 'answer_submitted', payload: { correct: true } });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      
      const mastery = evidence.find((e) => e.ruleId === 'mastery-from-answer');
      expect(mastery).toBeDefined();
      expect(mastery?.weight).toBe(1);
    });

    it('debería emitir evidencia negativa para respuesta incorrecta', () => {
      const event = ev({ eventType: 'answer_submitted', payload: { correct: false } });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      
      const mastery = evidence.find((e) => e.ruleId === 'mastery-from-answer');
      expect(mastery?.weight).toBe(-0.5);
    });

    it('debería ignorar respuesta correcta si se usó pista previa', () => {
      const event = ev({ eventType: 'answer_submitted', payload: { correct: true }, sequence: 3 });
      const context = {
        sessionEvents: [ev({ eventType: 'hint_requested', sequence: 1 })],
      };
      
      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'mastery-from-answer')).toBeUndefined();
    });
  });

  describe('persistenceFromRetry', () => {
    it('debería emitir evidencia de persistencia si hay fallo previo', () => {
      const event = ev({ eventType: 'attempt_repeated', payload: { attempt: 2 }, sequence: 2 });
      const context = {
        sessionEvents: [ev({ eventType: 'answer_submitted', payload: { correct: false }, sequence: 1 })],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      const persistence = evidence.find((e) => e.ruleId === 'persistence-from-retry');
      expect(persistence?.weight).toBe(1);
    });

    it('debería emitir persistencia negativa si los intentos > 5', () => {
      const event = ev({ eventType: 'attempt_repeated', payload: { attempt: 6 }, sequence: 2 });
      const context = {
        sessionEvents: [ev({ eventType: 'answer_submitted', payload: { correct: false }, sequence: 1 })],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      const persistence = evidence.find((e) => e.ruleId === 'persistence-from-retry');
      expect(persistence?.weight).toBe(-0.3);
    });

    it('debería ignorar el reintento si rewardCondition está activo', () => {
      const event = ev({ eventType: 'attempt_repeated', payload: { attempt: 2 }, sequence: 2 }, 'xp');
      const context = {
        sessionEvents: [ev({ eventType: 'answer_submitted', payload: { correct: false }, sequence: 1 })],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'persistence-from-retry')).toBeUndefined();
    });
  });

  describe('helpSeekingFromHint', () => {
    it('debería emitir evidencia de búsqueda de ayuda si se intentó primero', () => {
      const event = ev({ eventType: 'hint_requested', sequence: 3 });
      const context = {
        sessionEvents: [ev({ eventType: 'answer_submitted', payload: { correct: false }, sequence: 1 })],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'help-seeking-from-hint')).toBeDefined();
    });

    it('debería ignorar si no hubo intento previo', () => {
      const event = ev({ eventType: 'hint_requested', sequence: 1 });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'help-seeking-from-hint')).toBeUndefined();
    });
  });

  describe('flexibilityFromStrategyChange', () => {
    it('debería emitir evidencia de flexibilidad por cambio de estrategia', () => {
      const event = ev({ eventType: 'strategy_changed', sequence: 2 });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'flexibility-from-strategy-change')).toBeDefined();
    });

    it('debería ignorar si el cambio fue inducido por pista recientemente', () => {
      const event = ev({ eventType: 'strategy_changed', sequence: 3 });
      const context = {
        sessionEvents: [ev({ eventType: 'hint_requested', sequence: 2 })],
      };

      const evidence = deriveEvidence(event, context, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'flexibility-from-strategy-change')).toBeUndefined();
    });
  });

  describe('engagementFromCompletion', () => {
    it('debería emitir engagement positivo al completar', () => {
      const event = ev({ eventType: 'task_completed', sequence: 1 });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')?.weight).toBe(1);
    });

    it('debería emitir engagement negativo al abandonar', () => {
      const event = ev({ eventType: 'task_abandoned', sequence: 1 });
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')?.weight).toBe(-0.6);
    });

    it('debería ignorar si rewardCondition está activo', () => {
      const event = ev({ eventType: 'task_completed', sequence: 1 }, 'credits');
      const evidence = deriveEvidence(event, baseContext, EVIDENCE_RULES_V01);
      expect(evidence.find((e) => e.ruleId === 'engagement-from-completion')).toBeUndefined();
    });
  });
});