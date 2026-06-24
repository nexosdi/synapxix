import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  providers: [AppService],
})
export class AppModule {}