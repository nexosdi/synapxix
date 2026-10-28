import { IsArray, IsString, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EvaluateFillInTheBlanksDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userAnswers!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  correctAnswers!: string[];
}
