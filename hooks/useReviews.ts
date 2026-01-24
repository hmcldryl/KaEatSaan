'use client';

import { useEffect } from 'react';
import { useReviewStore } from '@/lib/store/reviewStore';

export function useReviews(restaurantId: string | null) {
  const {
    reviews,
    isLoading,
    error,
    loadReviews,
    stopListening,
    addReview,
    deleteReview,
  } = useReviewStore();

  useEffect(() => {
    if (restaurantId) {
      loadReviews(restaurantId);
    }

    return () => {
      stopListening();
    };
  }, [restaurantId, loadReviews, stopListening]);

  return {
    reviews,
    isLoading,
    error,
    addReview,
    deleteReview,
    reviewCount: reviews.length,
    averageRating:
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0,
  };
}
