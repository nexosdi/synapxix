import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateAiPromptDto {
  @IsString()
  @IsNotEmpty()
  gameType!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsInt()
  version?: number;
}
