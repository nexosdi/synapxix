import { IsNumber, IsOptional, IsString, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCognitiveEvaluationDto {
  @IsString()
  gameSessionId!: string;

  @IsString()
  historyId!: string;

  @IsString()
  gameType!: string;

  @IsString()
  category!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  durationSeconds!: number;

  @Type(() => Number)
  @IsNumber()
  score!: number;

  @Type(() => Number)
  @IsNumber()
  accuracy!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  correctAnswers!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  wrongAnswers!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hintsUsed!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  averageResponseTimeMs!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taskComplexity!: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
