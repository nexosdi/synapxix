import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject, Logger } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AiCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AiCacheInterceptor.name);
  private readonly responseCacheTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    // TTL is configured in seconds but passed to cacheManager in milliseconds
    this.responseCacheTtl = this.configService.get<number>('CACHE_TTL_SECONDS', 300) * 1000;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // We only cache POST requests to the research endpoint that contain a body
    if (request.method !== 'POST' || !request.body || !request.body.gameType || !request.body.studentResult) {
      return next.handle();
    }

    const { gameType, studentResult } = request.body;
    
    // Create a deterministic hash of the inputs
    const payloadToHash = JSON.stringify({ gameType, studentResult });
    const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');
    const cacheKey = `ai-response:${hash}`;

    try {
      const cachedResponse = await this.cacheManager.get(cacheKey);
      
      if (cachedResponse) {
        this.logger.debug(`[Cache HIT] Returning cached AI response: ${cacheKey}`);
        return of(cachedResponse);
      }
      
      this.logger.debug(`[Cache MISS] Proceeding to AI provider: ${cacheKey}`);
      
      return next.handle().pipe(
        tap(async (response) => {
          try {
            await this.cacheManager.set(cacheKey, response, this.responseCacheTtl);
            this.logger.debug(`[Cache STORE] Cached new AI response: ${cacheKey}`);
          } catch (err: any) {
            this.logger.error(`Failed to store response in cache: ${err.message}`);
          }
        }),
      );
    } catch (error: any) {
      this.logger.error(`Cache interceptor error: ${error.message}`);
      return next.handle(); // Fail open: proceed without caching if Redis is down
    }
  }
}
