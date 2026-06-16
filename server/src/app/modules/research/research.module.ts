import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { AiProvider } from './providers/ai.provider';
import { LearningModule } from '../../learning/learning.module';
import { PrismaModule } from '@nexosdi.synapxix/prisma';
import { AiPromptRepository } from './repositories/ai-prompt.repository';
import { AiPromptService } from './services/ai-prompt.service';
import { AiCacheInterceptor } from './interceptors/ai-cache.interceptor';

/**
 * ResearchModule — AI-powered pedagogical analysis.
 *
 * Provides the AiProvider (Google Gemini) and ResearchService to process
 * game activity results and generate pedagogical insights.
 *
 * The AiProvider is ready to be injected into any service within this module.
 * If another module needs AiProvider, either:
 *   1. Import ResearchModule and use ResearchService (recommended), or
 *   2. Add AiProvider to this module's `exports` array and import ResearchModule.
 *
 * Requires: ConfigModule.forRoot({ isGlobal: true }) in AppModule
 * so that ConfigService is available for AiProvider to read GOOGLE_GEN_AI_KEY.
 */
@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get<string>('REDIS_HOST', 'localhost'),
            port: config.get<number>('REDIS_PORT', 6379),
          },
          password: config.get<string>('REDIS_PASSWORD'), // Optional password for Redis
        }),
        ttl: config.get<number>('CACHE_TTL_SECONDS', 300) * 1000,
        max: config.get<number>('CACHE_MAX_ENTRIES', 100),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ResearchController],
  providers: [
    ResearchService,
    AiProvider,
    AiPromptRepository,
    AiPromptService,
    AiCacheInterceptor,
  ],
  exports: [AiProvider, AiPromptService],
})
export class ResearchModule {}