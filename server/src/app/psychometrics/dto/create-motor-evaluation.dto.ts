import { IsNumber, IsOptional, IsString, IsObject, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMotorEvaluationDto {
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
  movementPrecision!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  reactionTimeMs!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  completionRate!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  controlStability!: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
