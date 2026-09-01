// internal service event, if the user does not exist create it, idempotent check
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  embedding?: number[];
}

export class CreateTopicDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  topicContent: string;

  @IsArray()
  @IsOptional()
  topicVec?: number[];

  @IsNumber()
  @IsOptional()
  initialWeight?: number;
}

export class ReinforceTopicDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsNumber()
  @IsNotEmpty()
  delta: number;
}

export class SetPreferencesDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  prefKeys: string[];

  @IsNumber()
  @IsOptional()
  initWeight?: number;
}

export class InitMethodDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty({ message: 'El methodKey es obligatorio' })
  methodKey: string;

  @IsNumber()
  @IsOptional()
  initWeight?: number;
}

export class MethodFeedbackDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  methodKey: string;

  @IsNumber()
  @IsNotEmpty()
  delta: number;
}
