import { IsBoolean, IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class ClaimRewardDto {
  @IsUUID()
  gameSessionId!: string;
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(1000)
  score!: number;

  @IsBoolean()
  victory!: boolean;
}

