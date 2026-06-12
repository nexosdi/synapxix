export enum RewardType {
  VICTORY = 'GAME_VICTORY',
  PARTICIPATION = 'GAME_PARTICIPATION',
}

export const calculateGameReward = (victory: boolean, score: number): number => {
  const BASE_VICTORY = 100;
  const BASE_LOSS = 20;
  const baseAmount = victory ? BASE_VICTORY : BASE_LOSS;
  const bonus = Math.floor(score / 10);
  return baseAmount + bonus;
};

export const calculateXP = (victory: boolean, score: number): number => {
  const BASE_VICTORY = 50;
  const BASE_LOSS = 10;
  const baseAmount = victory ? BASE_VICTORY : BASE_LOSS;
  const scoreDivisor = victory ? 20 : 50;
  const bonus = Math.floor(score / scoreDivisor);
  return baseAmount + bonus;
};


export interface PurchaseValidationResult {
  valid: boolean;
  reason?: 'INSUFFICIENT_FUNDS';
}

export const validatePurchase = (
  currentBalance: number,
  itemPrice: number,
): PurchaseValidationResult => {
  if (currentBalance < itemPrice) {
    return { valid: false, reason: 'INSUFFICIENT_FUNDS' };
  }
  return { valid: true };
};