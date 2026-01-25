import { create } from "zustand";
import { ref, onValue, push, update, remove, off } from "firebase/database";
import { database } from "@/lib/firebase";
import { FoodOutlet } from "@/types/foodOutlet";
import { FilterState } from "@/types/filter";
import { UserLocation } from "@/types/geolocation";
import { calculateDistance } from "@/lib/utils/distance";

interface FoodOutletStore {
  outlets: FoodOutlet[];
  filteredOutlets: FoodOutlet[];
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;

  // Actions
  loadOutlets: () => void;
  stopListening: () => void;
  filterOutlets: (filters: FilterState) => void;
  calculateDistances: (userLocation: UserLocation) => void;
  addFoodOutlet: (outlet: Omit<FoodOutlet, "id">) => Promise<string | null>;
  updateOutlet: (id: string, updates: Partial<FoodOutlet>) => Promise<void>;
  deleteOutlet: (id: string) => Promise<void>;
}

export const useFoodOutletStore = create<FoodOutletStore>((set, get) => ({
  outlets: [],
  filteredOutlets: [],
  isLoading: false,
  error: null,
  unsubscribe: null,

  loadOutlets: () => {
    set({ isLoading: true, error: null });

    const outletsRef = ref(database, "food_outlets");

    const unsubscribe = () => {
      off(outletsRef);
    };

    onValue(
      outletsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const outletsList: FoodOutlet[] = Object.entries(data).map(
            ([id, value]) => ({
              ...(value as Omit<FoodOutlet, "id">),
              id,
            }),
          );
          set({
            outlets: outletsList,
            filteredOutlets: outletsList,
            isLoading: false,
          });
        } else {
          set({
            outlets: [],
            filteredOutlets: [],
            isLoading: false,
          });
        }
      },
      (error) => {
        set({
          error: error.message || "Failed to load food outlets",
          isLoading: false,
        });
      },
    );

    set({ unsubscribe });
  },

  stopListening: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  filterOutlets: (filters: FilterState) => {
    const { outlets } = get();

    let filtered = outlets.filter((outlet) => {
      // Budget filter
      const budgetMatch =
        outlet.budget >= filters.budget[0] &&
        outlet.budget <= filters.budget[1];

      // Distance filter
      const distanceMatch =
        !outlet.distance || outlet.distance <= filters.distance;

      // Classification filter
      const classificationMatch =
        filters.classifications.length === 0 ||
        filters.classifications.includes(outlet.classification);

      // Cuisine filter
      const cuisineMatch =
        filters.cuisines.length === 0 ||
        filters.cuisines.includes(outlet.cuisine);

      // Open/closed filter
      const openMatch = filters.includeClosedOutlets || outlet.isOpen !== false;

      // New places filter (created in last 30 days)
      let newPlaceMatch = true;
      if (filters.onlyNewPlaces) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const createdDate = new Date(outlet.createdAt);
        newPlaceMatch = createdDate >= thirtyDaysAgo;
      }

      return (
        budgetMatch &&
        distanceMatch &&
        classificationMatch &&
        cuisineMatch &&
        openMatch &&
        newPlaceMatch
      );
    });

    // Limit to maxOutlets by randomly selecting
    if (filtered.length > filters.maxOutlets) {
      // Shuffle and take first maxOutlets
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      filtered = shuffled.slice(0, filters.maxOutlets);
    }

    set({ filteredOutlets: filtered });
  },

  calculateDistances: (userLocation: UserLocation) => {
    const { outlets } = get();

    const outletsWithDistance = outlets.map((outlet) => ({
      ...outlet,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        outlet.location.latitude,
        outlet.location.longitude,
      ),
    }));

    // Sort by distance
    outletsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    set({ outlets: outletsWithDistance });
  },

  addFoodOutlet: async (outlet: Omit<FoodOutlet, "id">) => {
    try {
      const outletsRef = ref(database, "food_outlets");
      const newRef = await push(outletsRef, outlet);
      return newRef.key;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to add food outlet",
      });
      return null;
    }
  },

  updateOutlet: async (id: string, updates: Partial<FoodOutlet>) => {
    try {
      const outletRef = ref(database, `food_outlets/${id}`);
      await update(outletRef, updates);
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update food outlet",
      });
    }
  },

  deleteOutlet: async (id: string) => {
    try {
      const outletRef = ref(database, `food_outlets/${id}`);
      await remove(outletRef);
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete food outlet",
      });
    }
  },
}));
