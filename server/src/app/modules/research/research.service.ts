import { Injectable, Logger } from '@nestjs/common';
import { ProcessGameActivityDto } from './models/game-input.model';
import { AiProvider } from './providers/ai.provider';
import { LearningService } from '../../learning/learning.service';
import { AiPromptService } from './services/ai-prompt.service';

@Injectable()
export class ResearchService {
  private readonly logger = new Logger(ResearchService.name);

  constructor(
    private readonly aiProvider: AiProvider,
    private readonly learningService: LearningService,
    private readonly aiPromptService: AiPromptService,
  ) {}

  async processActivity(data: ProcessGameActivityDto) {
    const { gameType, gameInput, studentResult, studentId } = data;

    const defaultPrompt = `You are a pedagogical analyst evaluating a ${gameType} activity`;
    const systemPrompt = await this.aiPromptService.getPrompt(gameType, 'SYSTEM_ANALYSIS', defaultPrompt);
    const simplifiedContext = this.getSimplifiedContext(gameType, gameInput);

    const aiAnalysis = await this.aiProvider.analyzePedagogicalAction(
      systemPrompt,
      simplifiedContext,
      studentResult
    );

    const dimensionImpact = this.calculateDimensionImpact(studentResult);
    
    try {
      await this.learningService.reinforceTopic({
        userId: studentId,
        topicId: gameType,
        delta: studentResult.success ? 0.1 : -0.5
      });
    } catch (error: any) {
      this.logger.error(`Failed to update graph: ${error.message}`);
    }

    return {
      game: gameType,
      studentId: studentId,
      aiFeedback: aiAnalysis,
      analysisContext: `AI processing context: ${simplifiedContext}`,
      performanceSummary: {
        wasSuccessful: studentResult.success, 
        timeTaken: studentResult.duration,
        inputAnalyzed: studentResult.content
      },
      dimensionUpdate: dimensionImpact,
    };
  }

  private getSimplifiedContext(type: string, input: any): string {
    const contextMap: Record<string, () => string> = {
      'fill-in-the-blanks': () => `Sentence: ${input.sentence}. Blanks: ${input.blanks?.length || 0}`,
      'speak-about-photo': () => `Prompt: ${input.prompt}. Keywords: ${input.targetKeywords?.join(', ')}`,
      'listen-type': () => `Audio: ${input.audioUrl}. Expected: ${input.answer}`,
      'read-aloud': () => `Text: ${input.text}. Min Score: ${input.scoring?.minPronScore}%`,
      'avatar': () => `Legend: ${input.legend}. Options: ${input.options?.length}`,
    };
    return contextMap[type]?.() || 'General learning activity';
  }

  private calculateDimensionImpact(result: any): Record<string, number> {
    return {
      logic: result.success ? 0.9 : 0.4,
      creativity: result.duration < 60 ? 0.8 : 0.4,
      engagement: result.duration < 60 ? 0.8 : 0.4
    };
  }
}