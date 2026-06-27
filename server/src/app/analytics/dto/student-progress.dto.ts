import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * Data transfer object for the student progress.
 */
export class StudentProgressDto {
  /**
   * The student id.
   * @example 'clxvf8g2g000008l5g1g2g3g4'
   */
  @ApiProperty({
    description: 'The student ID.',
    example: 'clxvf8g2g000008l5g1g2g3g4',
  })
  @IsString()
  student_id: string;

  /**
   * The progress of the student.
   * @example 0.5
   */
  @ApiProperty({
    description: 'The progress of the student.',
    example: 0.5,
  })
  @IsNumber()
  progress: number;
}
