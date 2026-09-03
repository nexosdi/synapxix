import { app_user } from '@prisma/client';
import { randomUUID } from 'crypto';

export const createMockUser = (overrides?: Partial<app_user>): app_user => {
  return {
    id: randomUUID(),
    email: 'test@example.com',
    auth0_id: `auth0|${randomUUID()}`,
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
    updated_at: new Date(),
    status: 'ACTIVE',
    settings: {},
    ...overrides,
  };
};
