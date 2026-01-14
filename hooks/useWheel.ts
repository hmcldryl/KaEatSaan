import { useState, useCallback } from 'react';
import { Restaurant } from '@/types/restaurant';
import { useHistoryStore } from '@/lib/store/historyStore';
import { useFiltersStore } from '@/lib/store/filtersStore';

export function useWheel(restaurants: Restaurant[]) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Restaurant | null>(null);
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();

  const spin = useCallback(() => {
    if (isSpinning || restaurants.length === 0) {
      return;
    }

    setIsSpinning(true);

    // Simulate spin duration (actual animation will be handled by canvas component)
    setTimeout(() => {
      // Select random restaurant
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      const selectedRestaurant = restaurants[randomIndex];

      setResult(selectedRestaurant);
      setIsSpinning(false);

      // Add to history
      addHistoryEntry(selectedRestaurant, {
        budget: filters.budget,
        distance: filters.distance,
        cuisines: filters.cuisines,
        includeClosedRestaurants: filters.includeClosedRestaurants,
        onlyNewPlaces: filters.onlyNewPlaces,
      });
    }, 3500); // 3.5 second spin duration
  }, [isSpinning, restaurants, addHistoryEntry, filters]);

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
