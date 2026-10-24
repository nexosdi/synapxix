import { InteractiveContentBase } from '../../models/history.model';

export type TimelineOrderGameType = 'timeline-order';

export interface TimelineEvent {
  id: string;
  text: string;
  order: number;
}

export interface TimelineOrderGameData {
  prompt: string;
  events: TimelineEvent[];
  media?: string;
  locale: string;
}

export type TimelineOrderInteractiveContent = InteractiveContentBase<
  TimelineOrderGameType,
  TimelineOrderGameData
>;

export function toTimelineOrderGameModel(
  content: TimelineOrderInteractiveContent
): TimelineOrderGameData {
  return content.gameInput;
}