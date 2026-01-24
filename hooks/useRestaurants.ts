import { useEffect } from 'react';
import { useRestaurantStore } from '@/lib/store/restaurantStore';
import { useFiltersStore } from '@/lib/store/filtersStore';

export function useRestaurants() {
  const {
    restaurants,
    filteredRestaurants,
    isLoading,
    error,
    loadRestaurants,
    filterRestaurants,
  } = useRestaurantStore();

  const filters = useFiltersStore();

  // Load restaurants on mount
  useEffect(() => {
    if (restaurants.length === 0 && !isLoading) {
      loadRestaurants();
    }
  }, [restaurants.length, isLoading, loadRestaurants]);

  // Apply filters whenever they change
  useEffect(() => {
    if (restaurants.length > 0) {
      filterRestaurants({
        budget: filters.budget,
        distance: filters.distance,
        cuisines: filters.cuisines,
        includeClosedRestaurants: filters.includeClosedRestaurants,
        onlyNewPlaces: filters.onlyNewPlaces,
        maxRestaurants: filters.maxRestaurants,
      });
    }
  }, [
    restaurants.length,
    filters.budget,
    filters.distance,
    filters.cuisines,
    filters.includeClosedRestaurants,
    filters.onlyNewPlaces,
    filters.maxRestaurants,
    filterRestaurants,
  ]);

  return {
    restaurants: filteredRestaurants,
    allRestaurants: restaurants,
    isLoading,
    error,
  };
}
