import { create } from 'zustand';
import { Restaurant } from '@/types/restaurant';
import { FilterState } from '@/types/filter';

interface RestaurantStore {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadRestaurants: () => Promise<void>;
  filterRestaurants: (filters: FilterState) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  isLoading: false,
  error: null,

  loadRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/restaurants.json');
      if (!response.ok) {
        throw new Error('Failed to load restaurants');
      }
      const data: Restaurant[] = await response.json();
      set({
        restaurants: data,
        filteredRestaurants: data,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
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

  addRestaurant: (restaurant: Restaurant) => {
    set((state) => ({
      restaurants: [...state.restaurants, restaurant],
      filteredRestaurants: [...state.filteredRestaurants, restaurant],
    }));
  },

  updateRestaurant: (id: string, updates: Partial<Restaurant>) => {
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
      filteredRestaurants: state.filteredRestaurants.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteRestaurant: (id: string) => {
    set((state) => ({
      restaurants: state.restaurants.filter((r) => r.id !== id),
      filteredRestaurants: state.filteredRestaurants.filter((r) => r.id !== id),
    }));
  },
}));
