import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  name!: string; // <-- Agregado el !

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
  topicId!: string; // <-- Agregado el !

  @IsString()
  @IsNotEmpty()
  topicContent!: string; // <-- Agregado el !

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
  topicId!: string; // <-- Agregado el !

  @IsNumber()
  @IsNotEmpty()
  delta!: number; // <-- Agregado el !
}

export class SetPreferencesDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  prefKeys!: string[]; // <-- Agregado el !

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
  methodKey!: string; // <-- Agregado el !

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
  methodKey!: string; // <-- Agregado el !

  @IsNumber()
  @IsNotEmpty()
  delta!: number; // <-- Agregado el !
}