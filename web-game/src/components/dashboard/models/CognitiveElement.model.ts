export interface HistoryEntry {
  date: string;
  value: number;
}

export interface CognitiveElement {
  id: string;
  name: string;
  current_score: number;
  color: string;
  history: HistoryEntry[];
}