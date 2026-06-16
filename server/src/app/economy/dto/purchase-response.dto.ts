export class PurchaseResponseDto {
  status!: 'success';
  purchaseId!: string;
  itemId!: string;
  itemName!: string;
  itemType!: string;
  creditsSpent!: number;
  newBalance!: number;
  processedAt!: Date;
}