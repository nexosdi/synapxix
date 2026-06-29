import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, UseGuards, createParamDecorator, ExecutionContext, Res, Req } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { EvaluativeService } from './evaluative.service';
import { EvaluateSessionDto, EvaluateAiInputDto } from './dto/evaluate-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiProvider } from '../modules/research/providers/ai.provider';
import { Response, Request } from 'express';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data) return request.user?.[data];
  return request.user;
});

@Controller('evaluative')
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
  @UseGuards(JwtAuthGuard)
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
  @Throttle({ long: { limit: 10, ttl: 60000 } })
  @Post('evaluate-ai')
  @UseGuards(JwtAuthGuard)
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

  @Get('cohort-stats')
  @UseGuards(JwtAuthGuard)
  async getCohortStats() {
    return this.evaluativeService.getCohortStats();
  }

  @Get('students')
  @UseGuards(JwtAuthGuard)
  async getStudentList() {
    return this.evaluativeService.getStudentList();
  }

  @Get('students/:id/metrics')
  @UseGuards(JwtAuthGuard)
  async getStudentDetail(@Param('id') userId: string) {
    return this.evaluativeService.getStudentDetail(userId);
  }

  /**
   * SSE streaming endpoint for AI-driven evaluations.
   *
   * Streams AI-generated tokens in real time using Server-Sent Events.
   * Dispatches to the appropriate streaming method based on the payload:
   *   - Audio analysis (if audioBase64, expectedText, and audioMimeType are present)
   *   - Semantic/pedagogical analysis (otherwise)
   *
   * No authentication guard — Auth0 is not yet enabled.
   *
   * @example
   * ```bash
   * curl -N -X POST http://localhost:3000/api/evaluative/evaluate-ai/stream \
   *   -H "Content-Type: application/json" \
   *   -d '{"sessionId":"s1","promptOrContext":"Evaluate performance","studentTextResponse":"The answer is 42"}'
   * ```
   */
  @SkipThrottle()
  @Post('evaluate-ai/stream')
  async evaluateAiStream(
    @Body() dto: EvaluateAiInputDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(HttpStatus.OK);
    res.flushHeaders();

    const abortController = new AbortController();
    let isClosed = false;
    const onClose = () => {
      isClosed = true;
      abortController.abort();
    };
    req.on('close', onClose);

    try {
      let stream: AsyncGenerator<string>;

      // Dispatch to correct streaming method (Audio/Phonetic vs Semantic)
      if (dto.audioBase64 && dto.expectedText && dto.audioMimeType) {
        stream = this.aiProvider.streamAudio(
          dto.expectedText,
          dto.audioMimeType,
          dto.audioBase64,
          'read-aloud',
          abortController.signal,
        );
      } else {
        stream = this.aiProvider.streamPedagogicalAction(
          'You are an AI teacher evaluating cognitive and semantic performance.',
          dto.promptOrContext,
          dto.studentTextResponse || '',
          abortController.signal,
        );
      }

      for await (const chunk of stream) {
        if (isClosed) break;
        res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      if (!isClosed) {
        // Signal stream completion
        res.write(`event: done\ndata: [DONE]\n\n`);
      }
    } catch (error: any) {
      if (!isClosed && error.name !== 'AbortError') {
        res.write(`event: error\ndata: ${JSON.stringify({ message: error.message || 'Streaming failed' })}\n\n`);
      }
    } finally {
      req.off('close', onClose);
      if (!isClosed) {
        res.end();
      }
    }
  }
}
