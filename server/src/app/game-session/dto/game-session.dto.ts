import { IsOptional, IsString, IsNumber, IsBoolean, IsUUID } from 'class-validator';

export class StartSessionDto {
  @IsString()
  historyId!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class SubmitAttemptDto {
  @IsString()
  contentId!: string;

  @IsString()
  gameType!: string;

  @IsBoolean()
  isCorrect!: boolean;

  @IsNumber()
  score!: number;

  @IsOptional()
  @IsBoolean()
  completedQuickly?: boolean;
}
