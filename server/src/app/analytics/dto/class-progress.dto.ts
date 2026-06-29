import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object for the class progress.
 */
export class ClassProgressDto {
  /**
   * The class id.
   * @example 'clxvf8g2g000008l5g1g2g3g4'
   */
  @ApiProperty({
    description: 'The class ID.',
    example: 'clxvf8g2g000008l5g1g2g3g4',
  })
  @IsString()
  class_id: string;

  /**
   * The progress of the class.
   * @example 0.5
   */
  @ApiProperty({
    description: 'The progress of the class.',
    example: 0.5,
  })
  @IsNumber()
  progress: number;
}
