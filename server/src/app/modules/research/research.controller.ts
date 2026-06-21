import { Controller, Post, Body, UseInterceptors, Res, Req, HttpStatus } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ProcessGameActivityDto } from "./models/game-input.model";
import { AiCacheInterceptor } from "./interceptors/ai-cache.interceptor";
import { Response, Request } from "express";

@Controller('research')
export class ResearchController {
    constructor(
        private readonly researchService: ResearchService,
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
        @Req() req: Request,
    ) {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
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
            // Delegate domain logic (prompt + context resolution) to the service
            const stream = await this.researchService.processActivityStream(body, abortController.signal);

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