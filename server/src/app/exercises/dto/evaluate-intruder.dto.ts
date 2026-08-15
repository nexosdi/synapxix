import { IsString, IsNotEmpty } from 'class-validator';

export class EvaluateIntruderDto {
  @IsString()
  @IsNotEmpty()
  selectedItem!: string;

  @IsString()
  @IsNotEmpty()
  intruderItem!: string;
}
