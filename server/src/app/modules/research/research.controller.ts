import {Controller, Post, Body} from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ProcessGameActivityDto } from "./models/game-input.model";

@Controller('research')
export class ResearchController {
    constructor(private readonly researchService: ResearchService) {}
    
    @Post('process')
    async process(@Body() body: ProcessGameActivityDto) {
        return await this.researchService.processActivity(body);
    }
}