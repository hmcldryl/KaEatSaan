import { Restaurant } from './restaurant';
import { FilterState } from './filter';

export interface HistoryEntry {
  id: string;
  restaurant: Restaurant;
  timestamp: string;  // ISO date string
  filters: FilterState;
}

export interface GroupedHistory {
  today: HistoryEntry[];
  yesterday: HistoryEntry[];
  thisWeek: HistoryEntry[];
  older: HistoryEntry[];
}
