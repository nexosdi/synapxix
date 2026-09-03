import { GameSession } from '@prisma/client';
import { randomUUID } from 'crypto';

export const createMockGameSession = (overrides?: Partial<GameSession>): GameSession => {
  return {
    session_id: randomUUID(),
    user_id: randomUUID(),
    history_id: 'hist-1',
    category: 'DALA',
    started_at: new Date(),
    finished_at: null,
    status: 'playing',
    ...overrides,
  };
};
