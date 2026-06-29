import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * Data transfer object for the global motor average.
 */
export class GlobalMotorAverageDto {
  /**
   * The average score.
   * @example 100
   */
  @ApiProperty({
    description: 'The average score.',
    example: 100,
  })
  @IsNumber()
  average_score: number;

  /**
   * The rate of attempts completed quickly.
   * @example 0.8
   */
  @ApiProperty({
    description: 'The rate of attempts completed quickly.',
    example: 0.8,
  })
  @IsNumber()
  completed_quickly_rate: number;
}
