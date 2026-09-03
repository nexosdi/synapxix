import { game_session } from '@prisma/client';
import { randomUUID } from 'crypto';

export const createMockGameSession = (overrides?: Partial<game_session>): game_session => {
  return {
    id: randomUUID(),
    user_id: randomUUID(),
    game_type: 'DALA',
    started_at: new Date(),
    ended_at: null,
    status: 'IN_PROGRESS',
    data: {},
    ...overrides,
  };
};
