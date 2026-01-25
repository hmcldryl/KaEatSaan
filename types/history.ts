import { FoodOutlet } from './foodOutlet';
import { FilterState } from './filter';

export interface HistoryEntry {
  id: string;
  outlet: FoodOutlet;
  timestamp: string;  // ISO date string
  filters: FilterState;
}

export interface GroupedHistory {
  today: HistoryEntry[];
  yesterday: HistoryEntry[];
  thisWeek: HistoryEntry[];
  older: HistoryEntry[];
}
