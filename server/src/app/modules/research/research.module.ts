import { Module } from "@nestjs/common";
import { ResearchService } from "./research.service";
@Module({
    providers: [ResearchService],
    controllers: [],
    exports: [ResearchService],
})
export class ResearchModule {}