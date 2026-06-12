import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluateSessionDto, EvaluateAiInputDto } from './dto/evaluate-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiProvider } from '../modules/research/providers/ai.provider';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) return request.user?.[data];
  return request.user;
});

@Controller('evaluative')
@UseGuards(JwtAuthGuard)
export class EvaluativeController {
  constructor(
    private readonly evaluativeService: EvaluativeService,
    private readonly aiProvider: AiProvider,
  ) {}

  /**
   * Endpoint to process a game session and generate cognitive metrics.
   * Expects an exact structure of game data (EvaluateSessionDto).
   */
  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateSession(
    @GetUser('user_id') userId: string,
    @Body() dto: EvaluateSessionDto,
  ) {
    const metric = await this.evaluativeService.evaluateAndPersist({ ...dto, userId });
    return {
      success: true,
      message: 'Cognitive metrics evaluated and persisted successfully',
      data: metric,
    };
  }

  /**
   * Endpoint to process AI-driven evaluations (semantic or phonetic)
   * and translate them into standard cognitive metrics.
   */
  @Post('evaluate-ai')
  @HttpCode(HttpStatus.OK)
  async evaluateAiSession(
    @GetUser('user_id') userId: string,
    @Body() dto: EvaluateAiInputDto,
  ) {
    let aiResponseText: string;

    // Dispatch to correct AI analysis method (Audio/Phonetic vs Semantic)
    if (dto.audioBase64 && dto.expectedText && dto.audioMimeType) {
       aiResponseText = await this.aiProvider.analyzeAudio(
         dto.expectedText, 
         dto.audioMimeType, 
         dto.audioBase64
       );
    } else {
       aiResponseText = await this.aiProvider.analyzePedagogicalAction(
         'You are an AI teacher evaluating cognitive and semantic performance.',
         dto.promptOrContext,
         dto.studentTextResponse || ''
       );
    }

    // Process the raw AI analysis into DB standardized metrics
    const metric = await this.evaluativeService.transformAiToMetricsAndPersist(
      userId, 
      dto.sessionId, 
      aiResponseText
    );

    return {
      success: true,
      message: 'AI cognitive metrics evaluated and persisted successfully',
      data: metric,
    };
  }
}
