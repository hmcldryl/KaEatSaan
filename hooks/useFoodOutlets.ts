import { useEffect, useMemo, useRef } from "react";
import { useFoodOutletStore } from "@/lib/store/foodOutletStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useLocationStore } from "@/lib/store/locationStore";
import { useWheelListStore } from "@/lib/store/wheelListStore";

export function useFoodOutlets() {
  const {
    outlets,
    filteredOutlets,
    isLoading,
    error,
    loadOutlets,
    filterOutlets,
    calculateDistances,
  } = useFoodOutletStore();

  const filters = useFiltersStore();
  const { location } = useLocationStore();
  const customOrder = useWheelListStore((s) => s.customOrder);
  const excluded = useWheelListStore((s) => s.excluded);

  // Track if distances have been calculated for current location
  const lastLocationRef = useRef<{ lat: number; lon: number } | null>(null);

  // Load outlets on mount
  useEffect(() => {
    if (outlets.length === 0 && !isLoading) {
      loadOutlets();
    }
  }, [outlets.length, isLoading, loadOutlets]);

  // Calculate distances when location or outlets change
  useEffect(() => {
    if (location && outlets.length > 0) {
      // Only recalculate if location has changed significantly (>50m)
      const lastLoc = lastLocationRef.current;
      if (
        !lastLoc ||
        Math.abs(lastLoc.lat - location.latitude) > 0.0005 ||
        Math.abs(lastLoc.lon - location.longitude) > 0.0005
      ) {
        calculateDistances(location);
        lastLocationRef.current = {
          lat: location.latitude,
          lon: location.longitude,
        };
      }
    }
  }, [location, outlets.length, calculateDistances]);

  // Apply filters whenever they change
  useEffect(() => {
    if (outlets.length > 0) {
      filterOutlets({
        budget: filters.budget,
        distance: filters.distance,
        classifications: filters.classifications,
        cuisines: filters.cuisines,
        includeClosedOutlets: filters.includeClosedOutlets,
        onlyNewPlaces: filters.onlyNewPlaces,
        maxOutlets: filters.maxOutlets,
      });
    }
  }, [
    outlets.length,
    filters.budget,
    filters.distance,
    filters.classifications,
    filters.cuisines,
    filters.includeClosedOutlets,
    filters.onlyNewPlaces,
    filters.maxOutlets,
    filterOutlets,
  ]);

  const wheelOutlets = useMemo(() => {
    let list = filteredOutlets.filter((o) => !excluded.includes(o.id));
    if (customOrder && customOrder.length > 0) {
      const orderMap = new Map(customOrder.map((id, i) => [id, i]));
      list = [...list].sort((a, b) => {
        const ai = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
        const bi = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
        return ai - bi;
      });
    }
    return list;
  }, [filteredOutlets, customOrder, excluded]);

  return {
    outlets: wheelOutlets,
    rawFilteredOutlets: filteredOutlets,
    allOutlets: outlets,
    isLoading,
    error,
    hasLocation: location !== null,
  };
}
