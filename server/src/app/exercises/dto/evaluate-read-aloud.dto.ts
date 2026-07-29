import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EvaluateReadAloudDto {
  @IsString()
  @IsNotEmpty()
  expectedText!: string;

  @IsString()
  @IsNotEmpty()
  locale!: string;

  @IsString()
  @IsNotEmpty()
  contentId!: string;

  @IsOptional()
  @IsString()
  durationSec?: string;
}
