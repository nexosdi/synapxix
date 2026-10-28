export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Representación mínima para la lógica
export interface SessionWithAttemptsLogic {
  attempts: { is_correct: boolean }[];
}

export function computeDifficulty(sessions: SessionWithAttemptsLogic[]): DifficultyLevel {
  const attempts = sessions.flatMap((s) => s.attempts);
  
  if (attempts.length === 0) {
    return 'beginner';
  }
  
  const correctCount = attempts.filter((a) => a.is_correct).length;
  const accuracy = correctCount / attempts.length;
  
  if (accuracy >= 0.8) return 'advanced';
  if (accuracy >= 0.5) return 'intermediate';
  return 'beginner';
}
