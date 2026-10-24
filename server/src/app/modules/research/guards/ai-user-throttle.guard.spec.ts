import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { AiUserThrottleGuard } from './ai-user-throttle.guard';

describe('AiUserThrottleGuard', () => {
  let guard: AiUserThrottleGuard;
  let mockCacheManager: { get: jest.Mock; set: jest.Mock };
  let mockConfigService: { get: jest.Mock };

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue(10), // Default limit 10
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiUserThrottleGuard,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<AiUserThrottleGuard>(AiUserThrottleGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  function createMockExecutionContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow request if user is not defined (relies on AuthGuard)', async () => {
    const context = createMockExecutionContext(undefined);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should allow request if user has no sub', async () => {
    const context = createMockExecutionContext({ username: 'test' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should allow request and set cache to 1 if first time', async () => {
    mockCacheManager.get.mockResolvedValue(undefined);
    const context = createMockExecutionContext({ sub: 'user-123' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(mockCacheManager.get).toHaveBeenCalledWith('ai-throttle:user-123');
    expect(mockCacheManager.set).toHaveBeenCalledWith('ai-throttle:user-123', 1, 60000);
  });

  it('should allow request and increment cache if below limit', async () => {
    mockCacheManager.get.mockResolvedValue(5);
    const context = createMockExecutionContext({ sub: 'user-123' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(mockCacheManager.set).toHaveBeenCalledWith('ai-throttle:user-123', 6, 60000);
  });

  it('should throw HttpException 429 if at or above limit', async () => {
    mockCacheManager.get.mockResolvedValue(10);
    const context = createMockExecutionContext({ sub: 'user-123' });

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
    expect(mockCacheManager.set).not.toHaveBeenCalled();
  });
});
