import { useEffect, useRef } from 'react';
import { useRestaurantStore } from '@/lib/store/restaurantStore';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { useLocationStore } from '@/lib/store/locationStore';

export function useRestaurants() {
  const {
    restaurants,
    filteredRestaurants,
    isLoading,
    error,
    loadRestaurants,
    filterRestaurants,
    calculateDistances,
  } = useRestaurantStore();

  const filters = useFiltersStore();
  const { location } = useLocationStore();

  // Track if distances have been calculated for current location
  const lastLocationRef = useRef<{ lat: number; lon: number } | null>(null);

  // Load restaurants on mount
  useEffect(() => {
    if (restaurants.length === 0 && !isLoading) {
      loadRestaurants();
    }
  }, [restaurants.length, isLoading, loadRestaurants]);

  // Calculate distances when location or restaurants change
  useEffect(() => {
    if (location && restaurants.length > 0) {
      // Only recalculate if location has changed significantly (>50m)
      const lastLoc = lastLocationRef.current;
      if (
        !lastLoc ||
        Math.abs(lastLoc.lat - location.latitude) > 0.0005 ||
        Math.abs(lastLoc.lon - location.longitude) > 0.0005
      ) {
        calculateDistances(location);
        lastLocationRef.current = { lat: location.latitude, lon: location.longitude };
      }
    }
  }, [location, restaurants.length, calculateDistances]);

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
    hasLocation: location !== null,
  };
}
