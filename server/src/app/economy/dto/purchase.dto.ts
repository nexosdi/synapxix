import { IsUUID, IsNotEmpty } from 'class-validator';

export class PurchaseDto {
  @IsUUID()
  @IsNotEmpty()
  itemId!: string;
}

