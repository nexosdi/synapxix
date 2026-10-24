import { Module } from '@nestjs/common';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { Neo4jService } from './neo4j.service';

@Module({
  controllers: [LearningController],
  providers: [
    Neo4jService,
    LearningService,
  ],
  exports: [LearningService, Neo4jService],
})
export class LearningModule {}
