import { Module } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { ResearchController } from "./research.controller";
import { AiProvider } from "./providers/ai.provider";
import { LearningService } from "../../learning/learning.service";
import { LearningModule } from "../../learning/learning.module";
@Module({
    imports: [LearningModule],
    providers: [ResearchService, AiProvider],
    controllers: [ResearchController],
    exports: [ResearchService],
})
export class ResearchModule {}