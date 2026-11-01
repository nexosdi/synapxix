import { JwtStrategy, KeycloakJwtPayload } from './jwt.strategy';

jest.mock('passport-jwt', () => ({
  ExtractJwt: {
    fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(() => 'token'),
  },
  Strategy: class MockStrategy {
    name = 'jwt';
  },
}));

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
}));

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should map roles from realm_access and return payload without side effects', () => {
      const payload: KeycloakJwtPayload = {
        sub: 'user-id-123',
        preferred_username: 'student1',
        email: 'student1@school.org',
        realm_access: {
          roles: ['student', 'default-roles-synapxix'],
        },
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        sub: 'user-id-123',
        preferred_username: 'student1',
        email: 'student1@school.org',
        realm_access: {
          roles: ['student', 'default-roles-synapxix'],
        },
        roles: ['student', 'default-roles-synapxix'],
      });
    });

    it('should provide empty roles array if realm_access is missing', () => {
      const payload: KeycloakJwtPayload = {
        sub: 'user-without-roles',
        email: 'noroles@school.org',
      };

      const result = strategy.validate(payload);

      expect(result.roles).toEqual([]);
      expect(result.sub).toBe('user-without-roles');
    });

    it('should be a pure synchronous function without database operations', () => {
      const payload: KeycloakJwtPayload = { sub: 'pure-sync-user' };
      const result = strategy.validate(payload);

      // Validate that it returns a plain object directly, not a Promise
      expect(result).not.toBeInstanceOf(Promise);
      expect(result.sub).toBe('pure-sync-user');
    });
  });
});
