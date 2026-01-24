import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState } from '@/types/filter';
import { CuisineType, BudgetLevel } from '@/types/restaurant';

interface FiltersStore extends FilterState {
  // Actions
  setBudget: (range: [BudgetLevel, BudgetLevel]) => void;
  setDistance: (km: number) => void;
  toggleCuisine: (cuisine: CuisineType) => void;
  setIncludeClosedRestaurants: (include: boolean) => void;
  setOnlyNewPlaces: (onlyNew: boolean) => void;
  setMaxRestaurants: (max: number) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

const defaultFilters: FilterState = {
  budget: [1, 4],
  distance: 5,
  cuisines: [],
  includeClosedRestaurants: false,
  onlyNewPlaces: false,
  maxRestaurants: 20,
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      ...defaultFilters,

      setBudget: (range: [BudgetLevel, BudgetLevel]) => {
        set({ budget: range });
      },

      setDistance: (km: number) => {
        set({ distance: km });
      },

      toggleCuisine: (cuisine: CuisineType) => {
        set((state) => {
          const cuisines = state.cuisines.includes(cuisine)
            ? state.cuisines.filter((c) => c !== cuisine)
            : [...state.cuisines, cuisine];
          return { cuisines };
        });
      },

      setIncludeClosedRestaurants: (include: boolean) => {
        set({ includeClosedRestaurants: include });
      },

      setOnlyNewPlaces: (onlyNew: boolean) => {
        set({ onlyNewPlaces: onlyNew });
      },

      setMaxRestaurants: (max: number) => {
        set({ maxRestaurants: max });
      },

      resetFilters: () => {
        set(defaultFilters);
      },

      getActiveFiltersCount: () => {
        const state = get();
        let count = 0;

        // Budget is active if not full range
        if (state.budget[0] !== 1 || state.budget[1] !== 4) count++;

        // Distance is active if not default
        if (state.distance !== 5) count++;

        // Cuisines count
        count += state.cuisines.length;

        // Boolean filters
        if (state.includeClosedRestaurants) count++;
        if (state.onlyNewPlaces) count++;

        // Max restaurants is active if not default
        if (state.maxRestaurants !== 20) count++;

        return count;
      },
    }),
    {
      name: 'kaetsaan-filters',
    }
  )
);
