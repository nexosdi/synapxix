import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { AiPromptRepository } from '../repositories/ai-prompt.repository';

@Injectable()
export class AiPromptService {
  private readonly logger = new Logger(AiPromptService.name);
  private readonly promptCacheTtl: number;

  constructor(
    private readonly repository: AiPromptRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    // TTL is configured in seconds but passed to cacheManager in milliseconds
    this.promptCacheTtl = this.configService.get<number>('PROMPT_CACHE_TTL_SECONDS', 600) * 1000;
  }

  /**
   * Returns the active system prompt for a game type and category.
   * Results are cached in Redis to reduce DB round-trips.
   */
  async getPrompt(gameType: string, category: string, defaultPrompt?: string): Promise<string> {
    const cacheKey = `prompt:${gameType}:${category}`;

    try {
      // 1. Try to get from cache
      const cachedPrompt = await this.cacheManager.get<string>(cacheKey);
      if (cachedPrompt) {
        this.logger.debug(`[Cache HIT] Prompt loaded from cache: ${cacheKey}`);
        return cachedPrompt;
      }

      // 2. Fetch from DB
      this.logger.debug(`[Cache MISS] Fetching prompt from DB: ${cacheKey}`);
      const promptRecord = await this.repository.findActivePrompt(gameType, category);

      if (promptRecord) {
        // 3. Cache the fetched result
        await this.cacheManager.set(cacheKey, promptRecord.content, this.promptCacheTtl);
        return promptRecord.content;
      }
    } catch (error: any) {
      this.logger.error(`Error retrieving prompt for ${gameType} - ${category}: ${error.message}`);
    }

    // 4. Fallback if DB fetch fails or no record exists
    if (defaultPrompt) {
      this.logger.warn(`Using default fallback prompt for ${gameType} - ${category}`);
      return defaultPrompt;
    }

    this.logger.warn(`No prompt found and no fallback provided for ${gameType} - ${category}`);
    return `You are a pedagogical analyst evaluating a ${gameType} activity`; // Ultimate fallback
  }

  /**
   * Invalidates the cached prompt in Redis for a specific game type and category.
   */
  async invalidatePromptCache(gameType: string, category: string): Promise<void> {
    const cacheKey = `prompt:${gameType}:${category}`;
    await this.cacheManager.del(cacheKey);
    this.logger.log(`Invalidated prompt cache for: ${cacheKey}`);
  }
}
