import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * Data transfer object for the global cognitive average.
 */
export class GlobalCognitiveAverageDto {
  /**
   * The average accuracy of all users.
   * @example 0.85
   */
  @ApiProperty({
    description: 'The average accuracy of all users.',
    example: 0.85,
  })
  @IsNumber()
  accuracy: number;

  /**
   * The average reaction time of all users.
   * @example 1200
   */
  @ApiProperty({
    description: 'The average reaction time of all users in milliseconds.',
    example: 1200,
  })
  @IsNumber()
  reaction_time: number;

  /**
   * The average cognitive load of all users.
   * @example 0.75
   */
  @ApiProperty({
    description: 'The average cognitive load of all users.',
    example: 0.75,
  })
  @IsNumber()
  cognitive_load: number;

  /**
   * The average memory retention of all users.
   * @example 0.9
   */
  @ApiProperty({
    description: 'The average memory retention of all users.',
    example: 0.9,
  })
  @IsNumber()
  memory_retention: number;

  /**
   * The average attention span of all users.
   * @example 0.8
   */
  @ApiProperty({
    description: 'The average attention span of all users.',
    example: 0.8,
  })
  @IsNumber()
  attention_span: number;
}