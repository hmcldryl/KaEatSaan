'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Button,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Restaurant, BudgetLevel } from '@/types/restaurant';
import { useReviews } from '@/hooks/useReviews';
import { useAuthStore } from '@/lib/store/authStore';
import { formatDistance } from '@/lib/utils/distance';
import StarRating from '@/components/reviews/StarRating';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import MapContainer from '@/components/map/MapContainer';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  open: boolean;
  onClose: () => void;
}

const BUDGET_SYMBOLS: Record<BudgetLevel, string> = {
  1: '₱',
  2: '₱₱',
  3: '₱₱₱',
  4: '₱₱₱₱',
};

export default function RestaurantDetailModal({
  restaurant,
  open,
  onClose,
}: RestaurantDetailModalProps) {
  const { user } = useAuthStore();
  const { reviews, isLoading, addReview, deleteReview } = useReviews(
    open && restaurant ? restaurant.id : null
  );
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!restaurant) return null;

  const handleAddReview = async (rating: number, summary: string) => {
    if (!user) return;

    await addReview(
      restaurant.id,
      user.uid,
      user.displayName || 'Anonymous',
      user.photoURL || undefined,
      { rating, summary }
    );
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId, restaurant.id);
  };

  const handleGetDirections = () => {
    const { latitude, longitude } = restaurant.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const userHasReviewed = reviews.some((r) => r.userId === user?.uid);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #980404 0%, #c41e1e 100%)',
          color: 'white',
          p: 3,
          pb: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" fontWeight={700} sx={{ pr: 4 }}>
          {restaurant.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Chip
            label={restaurant.cuisine}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Chip
            icon={<AttachMoneyIcon sx={{ color: 'white !important', fontSize: 16 }} />}
            label={BUDGET_SYMBOLS[restaurant.budget]}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          {restaurant.distance !== undefined && (
            <Chip
              icon={<LocationOnIcon sx={{ color: 'white !important', fontSize: 16 }} />}
              label={formatDistance(restaurant.distance)}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <StarRating
            value={restaurant.averageRating || 0}
            readonly
            size="small"
            showValue
            count={restaurant.reviewCount}
          />
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Map */}
        <Box sx={{ height: 200 }}>
          <MapContainer
            center={[restaurant.location.latitude, restaurant.location.longitude]}
            zoom={16}
            markerPosition={[restaurant.location.latitude, restaurant.location.longitude]}
            height={200}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Address & Directions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <LocationOnIcon color="action" sx={{ mt: 0.25 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">{restaurant.location.address}</Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DirectionsIcon />}
              onClick={handleGetDirections}
            >
              Directions
            </Button>
          </Box>

          {/* Description */}
          {restaurant.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {restaurant.description}
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {restaurant.tags && restaurant.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {restaurant.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Reviews Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Reviews ({restaurant.reviewCount || 0})
            </Typography>
            {user && !userHasReviewed && !showReviewForm && (
              <Button
                size="small"
                startIcon={<RateReviewIcon />}
                onClick={() => setShowReviewForm(true)}
                sx={{ color: 'primary.main' }}
              >
                Write Review
              </Button>
            )}
          </Box>

          <Collapse in={showReviewForm}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <ReviewForm
                onSubmit={handleAddReview}
                onCancel={() => setShowReviewForm(false)}
              />
            </Box>
          </Collapse>

          <ReviewList
            reviews={reviews}
            isLoading={isLoading}
            onDelete={handleDeleteReview}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
