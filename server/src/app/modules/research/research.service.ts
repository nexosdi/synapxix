import { Injectable } from '@nestjs/common';
import { ProcessGameActivityDto } from './models/game-input.model';
import { AiProvider } from './providers/ai.provider';

@Injectable()
export class ResearchService {
  constructor(private readonly aiProvider: AiProvider) {}

  async processActivity(data: ProcessGameActivityDto) {
    const { gameType, gameInput, studentResult } = data;

    const systemPrompt = this.generateSystemPrompt(gameType);
    const simplifiedContext = this.simplifyContext(gameType, gameInput);

    const aiAnalysis = await this.aiProvider.analyzePedagogicalAction(
      systemPrompt,
      simplifiedContext,
      studentResult
    );

    return {
      game: gameType,
      studentId: data.studentId,
      aiFeedback: aiAnalysis,
      analysisContext: `AI processing context: ${simplifiedContext}`,
      performanceSummary: {
        wasSuccessful: studentResult.success, 
        timeTaken: studentResult.duration,
        inputAnalyzed: studentResult.content
      },
      dimensionUpdate: {
        logic: studentResult.success ? 0.9 : 0.4,
        creativity: 0.5
      }
    };
  }

  private generateSystemPrompt(type: string): string {
    return `You are a multimodal pedagogical analyst. Analyze the ${type} activity 
            to identify learning patterns and cognitive dimensions.`;
  }

  private simplifyContext(type: string, input: any): string {
    switch (type) {
      case 'fill-in-the-blanks':
        return `Fill-in-the-blanks: ${input.sentence}. Total blanks: ${input.blanks?.length || 0}`;
      case 'speak-about-photo':
        return `Photo description. Prompt: ${input.prompt}. Target keywords: ${input.targetKeywords?.join(', ')}`;
      case 'listen-type':
        return `Transcription. Audio URL: ${input.audioUrl}. Expected answer: ${input.answer}`;
      case 'read-aloud':
        return `Reading aloud. Text: ${input.text}. Required Pronunciation Score: ${input.scoring?.minPronScore}%`;
      case 'avatar':
        return `Avatar selection. Legend: ${input.legend}. Options available: ${input.options?.length}`;
      default:
        return 'General learning activity';
    }
  }
}