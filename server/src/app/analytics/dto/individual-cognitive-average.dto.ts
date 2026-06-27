import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GlobalCognitiveAverageDto } from './global-cognitive-average.dto';

/**
 * Data transfer object for the individual cognitive average.
 */
export class IndividualCognitiveAverageDto extends GlobalCognitiveAverageDto {
  /**
   * The user id.
   * @example 'clxvf8g2g000008l5g1g2g3g4'
   */
  @ApiProperty({
    description: 'The user ID.',
    example: 'clxvf8g2g000008l5g1g2g3g4',
  })
  @IsString()
  user_id: string;
}
