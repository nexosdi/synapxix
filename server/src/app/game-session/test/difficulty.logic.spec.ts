import { computeDifficulty, SessionWithAttemptsLogic } from '../difficulty.logic';

describe('computeDifficulty', () => {
  it('should return beginner if there are no sessions/attempts', () => {
    expect(computeDifficulty([])).toBe('beginner');
    expect(computeDifficulty([{ attempts: [] }])).toBe('beginner');
  });

  it('should return advanced if accuracy is 100%', () => {
    const sessions: SessionWithAttemptsLogic[] = [
      { attempts: [{ is_correct: true }, { is_correct: true }] },
    ];
    expect(computeDifficulty(sessions)).toBe('advanced');
  });

  it('should return beginner if accuracy is 0%', () => {
    const sessions: SessionWithAttemptsLogic[] = [
      { attempts: [{ is_correct: false }, { is_correct: false }] },
    ];
    expect(computeDifficulty(sessions)).toBe('beginner');
  });

  it('should return intermediate if accuracy is 50%', () => {
    const sessions: SessionWithAttemptsLogic[] = [
      { attempts: [{ is_correct: true }, { is_correct: false }] },
    ];
    expect(computeDifficulty(sessions)).toBe('intermediate');
  });

  it('should return intermediate for 79% accuracy (boundary)', () => {
    const sessions: SessionWithAttemptsLogic[] = [
      {
        attempts: Array(100).fill(null).map((_, i) => ({ is_correct: i < 79 })),
      },
    ];
    expect(computeDifficulty(sessions)).toBe('intermediate');
  });

  it('should return advanced for 80% accuracy (boundary)', () => {
    const sessions: SessionWithAttemptsLogic[] = [
      {
        attempts: Array(10).fill(null).map((_, i) => ({ is_correct: i < 8 })),
      },
    ];
    expect(computeDifficulty(sessions)).toBe('advanced');
  });
});
