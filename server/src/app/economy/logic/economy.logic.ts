export enum RewardType {
  VICTORY = 'GAME_VICTORY',
  PARTICIPATION = 'GAME_PARTICIPATION'
}

export const calculateGameReward = (victory: boolean, score: number): number => {
  const BASE_VICTORY = 100;
  const BASE_LOSS = 20;
  const baseAmount = victory ? BASE_VICTORY : BASE_LOSS;
  const bonus = Math.floor(score / 10);
  return baseAmount + bonus;
};