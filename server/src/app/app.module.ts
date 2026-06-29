import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LearningModule } from './learning/learning.module';
import { EconomyModule } from './economy/economy.module';
import { GameSessionModule } from './game-session/game-session.module';
import { ResearchModule } from './modules/research/research.module';
import { EvaluativeModule } from './evaluative/evaluative.module';
import { ExercisesModule } from './exercises/exercises.module';
import { AnalyticsModule } from './analytics/analytics.module';

/**
 * Root application module.
 *
 * - ConfigModule.forRoot({ isGlobal: true }) loads the .env file and makes
 *   ConfigService injectable across ALL modules without needing to import
 *   ConfigModule again. This is required by AiProvider (research module).
 *
 * - ResearchModule handles AI-powered pedagogical analysis via AiProvider.
 *   The AiProvider is ready to be injected in any module that imports
 *   ResearchModule (it exports ResearchService which depends on AiProvider).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3,  // max 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20,  // max 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 60,  // max 60 requests per minute
      },
    ]),
    AuthModule,
    LearningModule,
    EconomyModule,
    GameSessionModule,
    ResearchModule,
    EvaluativeModule,
    ExercisesModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}