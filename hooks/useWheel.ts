import { useState, useCallback } from 'react';
import { FoodOutlet } from '@/types/foodOutlet';
import { useHistoryStore } from '@/lib/store/historyStore';
import { useFiltersStore } from '@/lib/store/filtersStore';

export function useWheel(outlets: FoodOutlet[]) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<FoodOutlet | null>(null);
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();

  const spin = useCallback(() => {
    if (isSpinning || outlets.length === 0) {
      return;
    }

    setIsSpinning(true);

    // Simulate spin duration (actual animation will be handled by canvas component)
    setTimeout(() => {
      // Select random outlet
      const randomIndex = Math.floor(Math.random() * outlets.length);
      const selectedOutlet = outlets[randomIndex];

      setResult(selectedOutlet);
      setIsSpinning(false);

      // Add to history
      addHistoryEntry(selectedOutlet, {
        budget: filters.budget,
        distance: filters.distance,
        classifications: filters.classifications,
        cuisines: filters.cuisines,
        includeClosedOutlets: filters.includeClosedOutlets,
        onlyNewPlaces: filters.onlyNewPlaces,
        maxOutlets: filters.maxOutlets,
      });
    }, 3500); // 3.5 second spin duration
  }, [isSpinning, outlets, addHistoryEntry, filters]);

  const closeResult = useCallback(() => {
    setResult(null);
  }, []);

  const spinAgain = useCallback(() => {
    setResult(null);
    // Small delay before spinning again
    setTimeout(() => {
      spin();
    }, 300);
  }, [spin]);

  return {
    spin,
    isSpinning,
    result,
    closeResult,
    spinAgain,
  };
}
