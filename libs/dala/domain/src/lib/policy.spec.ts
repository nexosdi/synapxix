import { decideNextAction } from './policy';

describe('política de decisión determinista v0.1', () => {
  it('R1: riesgo de abandono (engagement < 0.35) prioriza re-enganche (ASK)', () => {
    const dec = decideNextAction({
      subjectId: 's-1',
      constructs: {
        task_engagement: { value: 0.3, confidence: 0.6, status: 'supported' }
      }
    });
    expect(dec.selectedAction).toBe('ASK');
    expect(dec.reasons[0].type).toBe('engagement_low');
  });

  it('R2: esfuerzo sin progreso (mastery < 0.45, persistence > 0.6) da HINT', () => {
    const dec = decideNextAction({
      subjectId: 's-1',
      constructs: {
        curricular_mastery: { value: 0.4, confidence: 0.6, status: 'supported' },
        persistence: { value: 0.7, confidence: 0.6, status: 'supported' }
      }
    });
    expect(dec.selectedAction).toBe('HINT');
    expect(dec.reasons[0].type).toBe('mastery_low_persistence_high');
  });

  it('R3: dominio alto (> 0.75) retira apoyo (WITHDRAW_SUPPORT)', () => {
    const dec = decideNextAction({
      subjectId: 's-1',
      constructs: {
        curricular_mastery: { value: 0.8, confidence: 0.6, status: 'supported' }
      }
    });
    expect(dec.selectedAction).toBe('WITHDRAW_SUPPORT');
    expect(dec.reasons[0].type).toBe('mastery_high');
  });

  it('R4: dependencia de ayuda (helpSeeking > 0.8, mastery < 0.6) pide intento autónomo (REFLECT)', () => {
    const dec = decideNextAction({
      subjectId: 's-1',
      constructs: {
        curricular_mastery: { value: 0.5, confidence: 0.6, status: 'supported' },
        help_seeking: { value: 0.9, confidence: 0.6, status: 'supported' }
      }
    });
    expect(dec.selectedAction).toBe('REFLECT');
    expect(dec.reasons[0].type).toBe('possible_help_dependence');
  });

  it('R0: por defecto sin señal suficiente verifica comprensión (VERIFY)', () => {
    const dec = decideNextAction({
      subjectId: 's-1',
      constructs: {
        curricular_mastery: { value: 0.5, confidence: 0.6, status: 'provisional' },
        persistence: { value: 0.5, confidence: 0.6, status: 'provisional' }
      }
    });
    expect(dec.selectedAction).toBe('VERIFY');
    expect(dec.reasons[0].type).toBe('insufficient_signal');
  });
});
