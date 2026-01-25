import { create } from 'zustand';
import { ref, onValue, push, remove, off, get, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Review, ReviewFormData } from '@/types/review';

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  currentRestaurantId: string | null;
  unsubscribe: (() => void) | null;

  // Actions
  loadReviews: (restaurantId: string) => void;
  stopListening: () => void;
  addReview: (
    restaurantId: string,
    userId: string,
    userName: string,
    userPhotoUrl: string | undefined,
    data: ReviewFormData
  ) => Promise<string | null>;
  deleteReview: (reviewId: string, restaurantId: string) => Promise<void>;
}

async function updateRestaurantRating(restaurantId: string) {
  try {
    const reviewsRef = ref(database, 'reviews');
    const snapshot = await get(reviewsRef);
    const data = snapshot.val();

    let totalRating = 0;
    let reviewCount = 0;

    if (data) {
      Object.values(data).forEach((review) => {
        const r = review as Review;
        if (r.restaurantId === restaurantId) {
          totalRating += r.rating;
          reviewCount++;
        }
      });
    }

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    const restaurantRef = ref(database, `restaurants/${restaurantId}`);
    await update(restaurantRef, {
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update restaurant rating:', error);
  }
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,
  currentRestaurantId: null,
  unsubscribe: null,

  loadReviews: (restaurantId: string) => {
    const { currentRestaurantId, unsubscribe } = get();

    // If already listening to this restaurant, don't reload
    if (currentRestaurantId === restaurantId && unsubscribe) {
      return;
    }

    // Stop previous listener
    if (unsubscribe) {
      unsubscribe();
    }

    set({ isLoading: true, error: null, currentRestaurantId: restaurantId });

    const reviewsRef = ref(database, 'reviews');

    const unsubscribeFunc = () => {
      off(reviewsRef);
    };

    onValue(
      reviewsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const reviewsList: Review[] = Object.entries(data)
            .map(([id, value]) => ({
              ...(value as Omit<Review, 'id'>),
              id,
            }))
            .filter((review) => review.restaurantId === restaurantId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          set({ reviews: reviewsList, isLoading: false });
        } else {
          set({ reviews: [], isLoading: false });
        }
      },
      (error) => {
        set({
          error: error.message || 'Failed to load reviews',
          isLoading: false,
        });
      }
    );

    set({ unsubscribe: unsubscribeFunc });
  },

  stopListening: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null, currentRestaurantId: null, reviews: [] });
    }
  },

  addReview: async (
    restaurantId: string,
    userId: string,
    userName: string,
    userPhotoUrl: string | undefined,
    data: ReviewFormData
  ) => {
    try {
      const reviewsRef = ref(database, 'reviews');
      const newReview = {
        restaurantId,
        userId,
        userName,
        userPhotoUrl: userPhotoUrl || null,
        rating: data.rating,
        summary: data.summary,
        createdAt: new Date().toISOString(),
      };

      const newRef = await push(reviewsRef, newReview);

      // Update restaurant rating
      await updateRestaurantRating(restaurantId);

      return newRef.key;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add review',
      });
      return null;
    }
  },

  deleteReview: async (reviewId: string, restaurantId: string) => {
    try {
      const reviewRef = ref(database, `reviews/${reviewId}`);
      await remove(reviewRef);

      // Update restaurant rating
      await updateRestaurantRating(restaurantId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete review',
      });
    }
  },
}));
