import { IsString, IsNotEmpty } from 'class-validator';

export class EvaluateCategorizationDto {
  @IsString()
  @IsNotEmpty()
  item!: string;

  @IsString()
  @IsNotEmpty()
  selectedCategory!: string;

  @IsString()
  @IsNotEmpty()
  correctCategory!: string;
}
