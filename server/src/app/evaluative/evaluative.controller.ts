import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EvaluativeService } from './evaluative.service';
import { EvaluateSessionDto } from './dto/evaluate-session.dto';

@Controller('evaluative')
export class EvaluativeController {
  constructor(private readonly evaluativeService: EvaluativeService) {}

  /**
   * Endpoint to process a game session and generate cognitive metrics.
   * Expects an exact structure of game data (EvaluateSessionDto).
   */
  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateSession(@Body() evaluateSessionDto: EvaluateSessionDto) {
    const metric = await this.evaluativeService.evaluateAndPersist(evaluateSessionDto);
    return {
      success: true,
      message: 'Cognitive metrics evaluated and persisted successfully',
      data: metric,
    };
  }
}
