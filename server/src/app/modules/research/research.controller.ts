import { Controller, Post, Body, UseInterceptors, Res, HttpStatus } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ProcessGameActivityDto } from "./models/game-input.model";
import { AiCacheInterceptor } from "./interceptors/ai-cache.interceptor";
import { AiProvider } from "./providers/ai.provider";
import { Response } from "express";
import { AiPromptService } from "./services/ai-prompt.service";

@Controller('research')
export class ResearchController {
    constructor(
        private readonly researchService: ResearchService,
        private readonly aiProvider: AiProvider,
        private readonly aiPromptService: AiPromptService,
    ) {}
    
    @Post('process')
    @UseInterceptors(AiCacheInterceptor)
    async process(@Body() body: ProcessGameActivityDto) {
        return await this.researchService.processActivity(body);
    }

    /**
     * SSE streaming endpoint for pedagogical analysis.
     *
     * Streams AI-generated tokens in real time using Server-Sent Events.
     * Each chunk is sent as an `event: chunk` with `data: {"text": "..."}`.
     * When the stream completes, an `event: done` with `data: [DONE]` is sent.
     * On error, an `event: error` with `data: {"message": "..."}` is sent.
     *
     * This endpoint does NOT use the AiCacheInterceptor because streaming
     * responses are not cacheable.
     *
     * @example
     * ```bash
     * curl -N -X POST http://localhost:3000/api/research/process/stream \
     *   -H "Content-Type: application/json" \
     *   -d '{"gameType":"fill-in-the-blanks","gameInput":{"sentence":"test"},"studentResult":{"success":true,"duration":30,"content":"test"},"studentId":"test-123"}'
     * ```
     */
    @Post('process/stream')
    async processStream(
        @Body() body: ProcessGameActivityDto,
        @Res() res: Response,
    ) {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
        res.status(HttpStatus.OK);
        res.flushHeaders();

        const { gameType, gameInput, studentResult } = body;

        const defaultPrompt = `You are a pedagogical analyst evaluating a ${gameType} activity`;
        const systemPrompt = await this.aiPromptService.getPrompt(gameType, 'SYSTEM_ANALYSIS', defaultPrompt);

        // Build simplified context inline (mirrors ResearchService logic)
        const contextMap: Record<string, () => string> = {
            'fill-in-the-blanks': () => `Sentence: ${gameInput.sentence}. Blanks: ${gameInput.blanks?.length || 0}`,
            'speak-about-photo': () => `Prompt: ${gameInput.prompt}. Keywords: ${gameInput.targetKeywords?.join(', ')}`,
            'listen-type': () => `Audio: ${gameInput.audioUrl}. Expected: ${gameInput.answer}`,
            'read-aloud': () => `Text: ${gameInput.text}. Min Score: ${gameInput.scoring?.minPronScore}%`,
            'avatar': () => `Legend: ${gameInput.legend}. Options: ${gameInput.options?.length}`,
        };
        const context = contextMap[gameType]?.() || 'General learning activity';

        try {
            const stream = this.aiProvider.streamPedagogicalAction(
                systemPrompt,
                context,
                studentResult,
            );

            for await (const chunk of stream) {
                res.write(`event: chunk\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
            }

            // Signal stream completion
            res.write(`event: done\ndata: [DONE]\n\n`);
        } catch (error: any) {
            res.write(`event: error\ndata: ${JSON.stringify({ message: error.message || 'Streaming failed' })}\n\n`);
        } finally {
            res.end();
        }
    }
}