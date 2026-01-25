import { create } from 'zustand';
import { ref, onValue, push, update, remove, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Restaurant } from '@/types/restaurant';
import { FilterState } from '@/types/filter';
import { UserLocation } from '@/types/geolocation';
import { calculateDistance } from '@/lib/utils/distance';

interface RestaurantStore {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;

  // Actions
  loadRestaurants: () => void;
  stopListening: () => void;
  filterRestaurants: (filters: FilterState) => void;
  calculateDistances: (userLocation: UserLocation) => void;
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<string | null>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  isLoading: false,
  error: null,
  unsubscribe: null,

  loadRestaurants: () => {
    set({ isLoading: true, error: null });

    const restaurantsRef = ref(database, 'restaurants');

    const unsubscribe = () => {
      off(restaurantsRef);
    };

    onValue(
      restaurantsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const restaurantsList: Restaurant[] = Object.entries(data).map(
            ([id, value]) => ({
              ...(value as Omit<Restaurant, 'id'>),
              id,
            })
          );
          set({
            restaurants: restaurantsList,
            filteredRestaurants: restaurantsList,
            isLoading: false,
          });
        } else {
          set({
            restaurants: [],
            filteredRestaurants: [],
            isLoading: false,
          });
        }
      },
      (error) => {
        set({
          error: error.message || 'Failed to load restaurants',
          isLoading: false,
        });
      }
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

  filterRestaurants: (filters: FilterState) => {
    const { restaurants } = get();

    let filtered = restaurants.filter((restaurant) => {
      // Budget filter
      const budgetMatch = restaurant.budget >= filters.budget[0] &&
                         restaurant.budget <= filters.budget[1];

      // Distance filter
      const distanceMatch = !restaurant.distance || restaurant.distance <= filters.distance;

      // Cuisine filter
      const cuisineMatch = filters.cuisines.length === 0 ||
                          filters.cuisines.includes(restaurant.cuisine);

      // Open/closed filter
      const openMatch = filters.includeClosedRestaurants || restaurant.isOpen !== false;

      // New places filter (created in last 30 days)
      let newPlaceMatch = true;
      if (filters.onlyNewPlaces) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const createdDate = new Date(restaurant.createdAt);
        newPlaceMatch = createdDate >= thirtyDaysAgo;
      }

      return budgetMatch && distanceMatch && cuisineMatch && openMatch && newPlaceMatch;
    });

    // Limit to maxRestaurants by randomly selecting
    if (filtered.length > filters.maxRestaurants) {
      // Shuffle and take first maxRestaurants
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      filtered = shuffled.slice(0, filters.maxRestaurants);
    }

    set({ filteredRestaurants: filtered });
  },

  calculateDistances: (userLocation: UserLocation) => {
    const { restaurants } = get();

    const restaurantsWithDistance = restaurants.map((restaurant) => ({
      ...restaurant,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      ),
    }));

    // Sort by distance
    restaurantsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    set({ restaurants: restaurantsWithDistance });
  },

  addRestaurant: async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      const restaurantsRef = ref(database, 'restaurants');
      const newRef = await push(restaurantsRef, restaurant);
      return newRef.key;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add restaurant',
      });
      return null;
    }
  },

  updateRestaurant: async (id: string, updates: Partial<Restaurant>) => {
    try {
      const restaurantRef = ref(database, `restaurants/${id}`);
      await update(restaurantRef, updates);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update restaurant',
      });
    }
  },

  deleteRestaurant: async (id: string) => {
    try {
      const restaurantRef = ref(database, `restaurants/${id}`);
      await remove(restaurantRef);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete restaurant',
      });
    }
  },
}));
