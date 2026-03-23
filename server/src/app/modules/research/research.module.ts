import { Module } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ResearchController } from "./research.controller";
import { AiProvider } from "./providers/ai.provider";
@Module({
    providers: [ResearchService, AiProvider],
    controllers: [ResearchController],
    exports: [ResearchService],
})
export class ResearchModule {}