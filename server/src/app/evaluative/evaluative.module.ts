import { Module } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluativeController } from './evaluative.controller';

@Module({
  controllers: [EvaluativeController],
  providers: [EvaluativeService],
})
export class EvaluativeModule {}
