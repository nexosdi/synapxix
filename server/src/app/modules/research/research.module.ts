import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { AiProvider } from './providers/ai.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ResearchController],
  providers: [ResearchService, AiProvider],
  exports: [AiProvider],
})
export class ResearchModule {}