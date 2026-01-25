import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterState } from '@/types/filter';
import { CuisineType, ClassificationType, BudgetLevel } from '@/types/foodOutlet';

interface FiltersStore extends FilterState {
  // Actions
  setBudget: (range: [BudgetLevel, BudgetLevel]) => void;
  setDistance: (km: number) => void;
  toggleClassification: (classification: ClassificationType) => void;
  toggleCuisine: (cuisine: CuisineType) => void;
  setIncludeClosedOutlets: (include: boolean) => void;
  setOnlyNewPlaces: (onlyNew: boolean) => void;
  setMaxOutlets: (max: number) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

const defaultFilters: FilterState = {
  budget: [1, 4],
  distance: 5,
  classifications: [],
  cuisines: [],
  includeClosedOutlets: false,
  onlyNewPlaces: false,
  maxOutlets: 20,
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

      toggleClassification: (classification: ClassificationType) => {
        set((state) => {
          const classifications = state.classifications.includes(classification)
            ? state.classifications.filter((c) => c !== classification)
            : [...state.classifications, classification];
          return { classifications };
        });
      },

      toggleCuisine: (cuisine: CuisineType) => {
        set((state) => {
          const cuisines = state.cuisines.includes(cuisine)
            ? state.cuisines.filter((c) => c !== cuisine)
            : [...state.cuisines, cuisine];
          return { cuisines };
        });
      },

      setIncludeClosedOutlets: (include: boolean) => {
        set({ includeClosedOutlets: include });
      },

      setOnlyNewPlaces: (onlyNew: boolean) => {
        set({ onlyNewPlaces: onlyNew });
      },

      setMaxOutlets: (max: number) => {
        set({ maxOutlets: max });
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

        // Classifications count
        count += state.classifications.length;

        // Cuisines count
        count += state.cuisines.length;

        // Boolean filters
        if (state.includeClosedOutlets) count++;
        if (state.onlyNewPlaces) count++;

        // Max outlets is active if not default
        if (state.maxOutlets !== 20) count++;

        return count;
      },
    }),
    {
      name: 'kaetsaan-filters',
    }
  )
);
