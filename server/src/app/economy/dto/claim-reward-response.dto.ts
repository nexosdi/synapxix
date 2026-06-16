export class ClaimRewardResponseDto {
  status!: 'success' | 'pending';
  transactionId!: string;
  balance!: {
    credits: number;
    experience_points: number;
  };

  reward!: {
    credits: number;
    xp: number;
  };

  processedAt?: string;
}
