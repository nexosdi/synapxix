import { IsString, IsArray, ValidateNested, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GameAttemptRecordDto {
  @IsString()
  contentId: string;

  @IsString()
  gameType: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsBoolean()
  completedQuickly?: boolean;

  @IsOptional()
  @IsNumber()
  reactionTimeMs?: number;
}

export class EvaluateSessionDto {
  @IsString()
  sessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameAttemptRecordDto)
  attempts: GameAttemptRecordDto[];
}
