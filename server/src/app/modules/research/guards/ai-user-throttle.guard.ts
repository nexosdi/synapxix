import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiUserThrottleGuard implements CanActivate {
  private readonly limit: number;
  private readonly ttlMs = 60000; // 1 minute window

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.limit = this.configService.get<number>('AI_RATE_LIMIT_PER_USER', 10);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      // If no user context, we allow it (or should we block? Let's allow but log, or just rely on JwtAuthGuard doing its job)
      return true;
    }

    const userId = user.sub;
    const cacheKey = `ai-throttle:${userId}`;

    const currentCount = await this.cacheManager.get<number>(cacheKey);

    if (currentCount !== undefined && currentCount >= this.limit) {
      throw new HttpException(
        'AI rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (currentCount === undefined) {
      await this.cacheManager.set(cacheKey, 1, this.ttlMs);
    } else {
      // cache-manager store specific handling for incrementing
      // Redis store often has a ttl in ms for v5 cache-manager
      await this.cacheManager.set(cacheKey, currentCount + 1, this.ttlMs);
    }

    return true;
  }
}
