import { app_user } from '@prisma/client';
import { randomUUID } from 'crypto';

export const createMockUser = (overrides?: Partial<app_user>): app_user => {
  return {
    user_id: randomUUID(),
    username: 'testuser',
    email: 'test@example.com',
    firstname: 'Test',
    lastname: 'User',
    role: 'user',
    created_at: new Date(),
    active: true,
    credits: 0,
    experience_points: 0,
    ...overrides,
  };
};
