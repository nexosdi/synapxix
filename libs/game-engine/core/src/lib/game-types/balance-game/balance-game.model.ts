import { InteractiveContentBase } from '../../models/history.model';

export type BalanceGameType = 'balance-master';

export interface BalanceSide {
  value: number;
  label: string;
  imageUrl?: string; // Para comparar grupos de objetos visuales
}

export interface BalanceGameData {
  prompt: string;
  leftSide: BalanceSide;
  rightSide: BalanceSide;
  correctOperator: '>' | '<' | '=';
  locale: string;
}

export type BalanceInteractiveContent = InteractiveContentBase<
  BalanceGameType,
  BalanceGameData
>;

export function toBalanceModel(content: BalanceInteractiveContent): BalanceGameData {
  return content.gameInput;
}