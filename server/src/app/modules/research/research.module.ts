import { Module } from '@nestjs/common';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';
import { AiProvider } from './providers/ai.provider';
import { LearningService } from '../../learning/learning.service';
import { LearningModule } from '../../learning/learning.module';
import { ConfigModule } from '@nestjs/config';

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
  imports: [ConfigModule],
  controllers: [ResearchController],
  providers: [ResearchService, AiProvider],
  exports: [AiProvider],
})
export class ResearchModule {}