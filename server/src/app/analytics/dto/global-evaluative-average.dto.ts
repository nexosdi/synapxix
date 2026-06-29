import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * Data transfer object for the global evaluative average.
 */
export class GlobalEvaluativeAverageDto {
  /**
   * The success rate, based on the `is_correct` field.
   * @example 0.95
   */
  @ApiProperty({
    description: 'The success rate, based on the `is_correct` field.',
    example: 0.95,
  })
  @IsNumber()
  success_rate: number;
}
