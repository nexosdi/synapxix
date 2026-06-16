import { Test, TestingModule } from '@nestjs/testing';
import { AiCacheInterceptor } from './ai-cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import * as crypto from 'crypto';

describe('AiCacheInterceptor', () => {
  let interceptor: AiCacheInterceptor;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiCacheInterceptor,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(300),
          },
        },
      ],
    }).compile();

    interceptor = module.get<AiCacheInterceptor>(AiCacheInterceptor);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should skip caching for non-POST requests', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET' }),
      }),
    } as ExecutionContext;
    const next = { handle: jest.fn() } as CallHandler;

    await interceptor.intercept(context, next);
    expect(next.handle).toHaveBeenCalled();
    expect(cacheManager.get).not.toHaveBeenCalled();
  });

  it('should return cached response on hit', async () => {
    const body = { gameType: 'test', studentResult: { success: true } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'POST', body }),
      }),
    } as ExecutionContext;
    const next = { handle: jest.fn() } as CallHandler;

    cacheManager.get.mockResolvedValue({ analysis: 'cached' });

    const result = await interceptor.intercept(context, next);
    let output;
    result.subscribe(val => output = val);
    
    expect(output).toEqual({ analysis: 'cached' });
    expect(next.handle).not.toHaveBeenCalled();
  });
});
