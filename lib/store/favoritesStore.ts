import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: string[];  // Restaurant IDs

  // Actions
  addFavorite: (restaurantId: string) => void;
  removeFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (restaurantId: string) => {
        set((state) => {
          if (state.favorites.includes(restaurantId)) {
            return state;
          }
          return { favorites: [...state.favorites, restaurantId] };
        });
      },

      removeFavorite: (restaurantId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== restaurantId),
        }));
      },

      isFavorite: (restaurantId: string) => {
        return get().favorites.includes(restaurantId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'kaetsaan-favorites',
    }
  )
);
