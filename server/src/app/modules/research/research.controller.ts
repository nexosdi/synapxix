import {Controller, Post, Body, UseInterceptors} from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ProcessGameActivityDto } from "./models/game-input.model";
import { AiCacheInterceptor } from "./interceptors/ai-cache.interceptor";

@Controller('research')
export class ResearchController {
    constructor(private readonly researchService: ResearchService) {}
    
    @Post('process')
    @UseInterceptors(AiCacheInterceptor)
    async process(@Body() body: ProcessGameActivityDto) {
        return await this.researchService.processActivity(body);
    }
}