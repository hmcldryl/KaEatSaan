import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favorites: string[]; // Restaurant IDs

  // Actions
  addFavorite: (outletId: string) => void;
  removeFavorite: (outletId: string) => void;
  isFavorite: (outletId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (outletId: string) => {
        set((state) => {
          if (state.favorites.includes(outletId)) {
            return state;
          }
          return { favorites: [...state.favorites, outletId] };
        });
      },

      removeFavorite: (outletId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== outletId),
        }));
      },

      isFavorite: (outletId: string) => {
        return get().favorites.includes(outletId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "kaetsaan-favorites",
    },
  ),
);
