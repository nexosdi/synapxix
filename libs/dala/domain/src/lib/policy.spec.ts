import { decideNextAction, PolicyInput } from './policy';
import { ConstructEstimate } from '@nexosdi.synapxix/dala/contracts';

describe('Policy', () => {
  const createEstimate = (
    value: number,
    confidence: number = 0.8,
    status: ConstructEstimate['status'] = 'supported'
  ): Pick<ConstructEstimate, 'value' | 'confidence' | 'status'> => ({
    value,
    confidence,
    status,
  });

  it('should return R1 if engagement is low', () => {
    const input: PolicyInput = {
      subjectId: 'user1',
      constructs: {
        task_engagement: createEstimate(0.2), // < 0.35
      },
    };

    const result = decideNextAction(input);
    expect(result.objective).toBe('restore_task_engagement');
    expect(result.selectedAction).toBe('ASK');
  });

  it('should return R2 if mastery is low and persistence is high without help seeking', () => {
    const input: PolicyInput = {
      subjectId: 'user1',
      constructs: {
        curricular_mastery: createEstimate(0.3), // < 0.45
        persistence: createEstimate(0.7), // > 0.6
        help_seeking: createEstimate(0.2), // < 0.4
      },
    };

    const result = decideNextAction(input);
    expect(result.objective).toBe('unblock_with_minimal_hint');
    expect(result.selectedAction).toBe('HINT');
  });

  it('should return R3 if mastery is high', () => {
    const input: PolicyInput = {
      subjectId: 'user1',
      constructs: {
        curricular_mastery: createEstimate(0.8), // > 0.75
      },
    };

    const result = decideNextAction(input);
    expect(result.objective).toBe('verify_transfer_without_support');
    expect(result.selectedAction).toBe('WITHDRAW_SUPPORT');
  });

  it('should return R4 if help seeking is high and mastery is low', () => {
    const input: PolicyInput = {
      subjectId: 'user1',
      constructs: {
        help_seeking: createEstimate(0.9), // > 0.8
        curricular_mastery: createEstimate(0.4), // < 0.6
      },
    };

    const result = decideNextAction(input);
    expect(result.objective).toBe('promote_autonomous_attempt');
    expect(result.selectedAction).toBe('REFLECT');
  });

  it('should return R0 (default) if no rules match or evidence is insufficient', () => {
    const input: PolicyInput = {
      subjectId: 'user1',
      constructs: {
        curricular_mastery: createEstimate(0.6), // Middle
        persistence: createEstimate(0.5),
        help_seeking: createEstimate(0.5),
        task_engagement: createEstimate(0.8),
      },
    };

    const result = decideNextAction(input);
    expect(result.objective).toBe('gather_evidence');
    expect(result.selectedAction).toBe('VERIFY');
  });
});
