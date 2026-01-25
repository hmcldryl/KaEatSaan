import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryEntry, GroupedHistory } from '@/types/history';
import { FoodOutlet } from '@/types/foodOutlet';
import { FilterState } from '@/types/filter';

interface HistoryStore {
  history: HistoryEntry[];

  // Actions
  addEntry: (outlet: FoodOutlet, filters: FilterState) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  getGroupedHistory: () => GroupedHistory;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      history: [],

      addEntry: (outlet: FoodOutlet, filters: FilterState) => {
        const entry: HistoryEntry = {
          id: `${Date.now()}-${outlet.id}`,
          outlet,
          timestamp: new Date().toISOString(),
          filters,
        };

        set((state) => {
          // Add new entry at the beginning
          const newHistory = [entry, ...state.history];

          // Keep only last 100 entries
          const trimmedHistory = newHistory.slice(0, 100);

          // Remove entries older than 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const filteredHistory = trimmedHistory.filter((entry) => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= thirtyDaysAgo;
          });

          return { history: filteredHistory };
        });
      },

      removeEntry: (id: string) => {
        set((state) => ({
          history: state.history.filter((entry) => entry.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      getGroupedHistory: () => {
        const { history } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const grouped: GroupedHistory = {
          today: [],
          yesterday: [],
          thisWeek: [],
          older: [],
        };

        history.forEach((entry) => {
          const entryDate = new Date(entry.timestamp);
          const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

          if (entryDay.getTime() === today.getTime()) {
            grouped.today.push(entry);
          } else if (entryDay.getTime() === yesterday.getTime()) {
            grouped.yesterday.push(entry);
          } else if (entryDay >= weekAgo) {
            grouped.thisWeek.push(entry);
          } else {
            grouped.older.push(entry);
          }
        });

        return grouped;
      },
    }),
    {
      name: 'kaetsaan-history',
    }
  )
);
