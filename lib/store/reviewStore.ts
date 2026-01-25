import { create } from 'zustand';
import { ref, onValue, push, remove, off, get, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Review, ReviewFormData } from '@/types/review';

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  currentOutletId: string | null;
  unsubscribe: (() => void) | null;

  // Actions
  loadReviews: (outletId: string) => void;
  stopListening: () => void;
  addReview: (
    outletId: string,
    userId: string,
    userName: string,
    userPhotoUrl: string | undefined,
    data: ReviewFormData
  ) => Promise<string | null>;
  deleteReview: (reviewId: string, outletId: string) => Promise<void>;
}

async function updateOutletRating(outletId: string) {
  try {
    const reviewsRef = ref(database, 'reviews');
    const snapshot = await get(reviewsRef);
    const data = snapshot.val();

    let totalRating = 0;
    let reviewCount = 0;

    if (data) {
      Object.values(data).forEach((review) => {
        const r = review as Review;
        if (r.outletId === outletId) {
          totalRating += r.rating;
          reviewCount++;
        }
      });
    }

    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    const outletRef = ref(database, `food_outlets/${outletId}`);
    await update(outletRef, {
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update outlet rating:', error);
  }
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,
  currentOutletId: null,
  unsubscribe: null,

  loadReviews: (outletId: string) => {
    const { currentOutletId, unsubscribe } = get();

    // If already listening to this outlet, don't reload
    if (currentOutletId === outletId && unsubscribe) {
      return;
    }

    // Stop previous listener
    if (unsubscribe) {
      unsubscribe();
    }

    set({ isLoading: true, error: null, currentOutletId: outletId });

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
            .filter((review) => review.outletId === outletId)
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
      set({ unsubscribe: null, currentOutletId: null, reviews: [] });
    }
  },

  addReview: async (
    outletId: string,
    userId: string,
    userName: string,
    userPhotoUrl: string | undefined,
    data: ReviewFormData
  ) => {
    try {
      const reviewsRef = ref(database, 'reviews');
      const newReview = {
        outletId,
        userId,
        userName,
        userPhotoUrl: userPhotoUrl || null,
        rating: data.rating,
        summary: data.summary,
        createdAt: new Date().toISOString(),
      };

      const newRef = await push(reviewsRef, newReview);

      // Update outlet rating
      await updateOutletRating(outletId);

      return newRef.key;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add review',
      });
      return null;
    }
  },

  deleteReview: async (reviewId: string, outletId: string) => {
    try {
      const reviewRef = ref(database, `reviews/${reviewId}`);
      await remove(reviewRef);

      // Update outlet rating
      await updateOutletRating(outletId);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete review',
      });
    }
  },
}));
