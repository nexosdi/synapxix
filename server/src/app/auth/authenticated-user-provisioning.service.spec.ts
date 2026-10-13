import { UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUserProvisioningService } from './authenticated-user-provisioning.service';

describe('AuthenticatedUserProvisioningService', () => {
  const userId = 'd4b5c6a7-1234-4234-9234-123456789abc';
  let upsert: jest.Mock;
  let service: AuthenticatedUserProvisioningService;

  beforeEach(() => {
    upsert = jest.fn().mockResolvedValue({ user_id: userId });
    service = new AuthenticatedUserProvisioningService({ app_user: { upsert } } as never);
  });

  it('provisions verified identity fields on the first authenticated request', async () => {
    await service.ensureUser({ sub: userId, preferred_username: 'ada', email: 'ada@example.test', name: 'Ada Lovelace' });

    expect(upsert).toHaveBeenCalledWith({
      where: { user_id: userId },
      create: { user_id: userId, username: 'ada', email: 'ada@example.test', firstname: 'Ada', lastname: 'Lovelace' },
      update: { username: 'ada', email: 'ada@example.test', firstname: 'Ada', lastname: 'Lovelace' },
    });
  });

  it('uses an idempotent upsert for repeated authenticated requests', async () => {
    const claims = { sub: userId, preferred_username: 'ada', email: 'ada@example.test' };
    await service.ensureUser(claims);
    await service.ensureUser(claims);

    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert.mock.calls[0]).toEqual(upsert.mock.calls[1]);
  });

  it('does not update an existing role or overwrite absent optional claims', async () => {
    await service.ensureUser({ sub: userId });

    const update = upsert.mock.calls[0][0].update;
    expect(update).toEqual({});
    expect(update).not.toHaveProperty('role');
  });

  it('rejects malformed subjects before accessing Prisma', async () => {
    await expect(service.ensureUser({ sub: 'not-a-uuid' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('supplies required identity fallbacks without persisting token material', async () => {
    await service.ensureUser({ sub: userId });

    expect(upsert.mock.calls[0][0].create).toEqual({
      user_id: userId,
      username: `user-${userId.slice(0, 8)}`,
      email: `${userId}@identity.invalid`,
      firstname: `user-${userId.slice(0, 8)}`,
      lastname: '',
    });
    expect(upsert.mock.calls[0][0].create).not.toHaveProperty('token');
  });
});
