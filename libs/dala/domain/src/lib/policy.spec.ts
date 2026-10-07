import { decideNextAction, PolicyInput } from './policy';
import type { ConstructEstimate } from '@nexosdi.synapxix/dala/contracts';

describe('D.A.L.A. Core - Deterministic Decision Policy v0.1 (policy.spec.ts)', () => {
  const createEstimate = (
    value: number,
    confidence: number = 0.8,
    status: ConstructEstimate['status'] = 'supported'
  ): Pick<ConstructEstimate, 'value' | 'confidence' | 'status'> => ({
    value,
    confidence,
    status,
  });

  it('R1: abandonment risk (engagement < 0.35) prioritizes re-engagement (ASK)', () => {
    const input: PolicyInput = {
      subjectId: 's-1',
      constructs: {
        task_engagement: createEstimate(0.3, 0.6, 'supported'),
      },
    };
    const dec = decideNextAction(input);
    expect(dec.objective).toBe('restore_task_engagement');
    expect(dec.selectedAction).toBe('ASK');
    expect(dec.reasons[0].type).toBe('engagement_low');
  });

  it('R2: effort without progress (mastery < 0.45, persistence > 0.6) yields HINT', () => {
    const input: PolicyInput = {
      subjectId: 's-1',
      constructs: {
        curricular_mastery: createEstimate(0.4, 0.6, 'supported'),
        persistence: createEstimate(0.7, 0.6, 'supported'),
        help_seeking: createEstimate(0.2, 0.6, 'supported'),
      },
    };
    const dec = decideNextAction(input);
    expect(dec.objective).toBe('unblock_with_minimal_hint');
    expect(dec.selectedAction).toBe('HINT');
    expect(dec.reasons[0].type).toBe('mastery_low_persistence_high');
  });

  it('R3: high mastery (> 0.75) withdraws support (WITHDRAW_SUPPORT)', () => {
    const input: PolicyInput = {
      subjectId: 's-1',
      constructs: {
        curricular_mastery: createEstimate(0.8, 0.6, 'supported'),
      },
    };
    const dec = decideNextAction(input);
    expect(dec.objective).toBe('verify_transfer_without_support');
    expect(dec.selectedAction).toBe('WITHDRAW_SUPPORT');
    expect(dec.reasons[0].type).toBe('mastery_high');
  });

  it('R4: help dependence (helpSeeking > 0.8, mastery < 0.6) triggers reflection (REFLECT)', () => {
    const input: PolicyInput = {
      subjectId: 's-1',
      constructs: {
        curricular_mastery: createEstimate(0.5, 0.6, 'supported'),
        help_seeking: createEstimate(0.9, 0.6, 'supported'),
      },
    };
    const dec = decideNextAction(input);
    expect(dec.objective).toBe('promote_autonomous_attempt');
    expect(dec.selectedAction).toBe('REFLECT');
    expect(dec.reasons[0].type).toBe('possible_help_dependence');
  });

  it('R0: defaults to VERIFY when there is insufficient signal', () => {
    const input: PolicyInput = {
      subjectId: 's-1',
      constructs: {
        curricular_mastery: createEstimate(0.5, 0.6, 'provisional'),
        persistence: createEstimate(0.5, 0.6, 'provisional'),
        task_engagement: createEstimate(0.8, 0.6, 'provisional'),
      },
    };
    const dec = decideNextAction(input);
    expect(dec.objective).toBe('gather_evidence');
    expect(dec.selectedAction).toBe('VERIFY');
    expect(dec.reasons[0].type).toBe('insufficient_signal');
  });
});
