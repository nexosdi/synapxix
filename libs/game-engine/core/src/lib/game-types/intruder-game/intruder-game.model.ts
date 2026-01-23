import { InteractiveContentBase } from '../../models/history.model';

export type Intruder = 'intruder';

export interface OptionItem {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean; // El intruso es el 'true'
}

export interface OddOneOutData {
  prompt: string;
  options: OptionItem[];
  explanation?: string; // Por si queremos explicar por qué era el intruso
  locale: string;
}

export type OddOneOutInteractiveContent = InteractiveContentBase<
  Intruder,
  OddOneOutData
>;

export function toOddOneOutModel(content: OddOneOutInteractiveContent): OddOneOutData {
  return content.gameInput;
}