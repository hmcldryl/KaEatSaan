"use client";

import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DirectionsIcon from "@mui/icons-material/Directions";
import { FoodOutlet, BudgetLevel } from "@/types/foodOutlet";
import { useReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/lib/store/authStore";
import { formatDistance } from "@/lib/utils/distance";
import StarRating from "@/components/reviews/StarRating";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import MapContainer from "@/components/map/MapContainer";

interface FoodOutletDetailModalProps {
  outlet: FoodOutlet | null;
  open: boolean;
  onClose: () => void;
}

const BUDGET_SYMBOLS: Record<BudgetLevel, string> = {
  1: "₱",
  2: "₱₱",
  3: "₱₱₱",
  4: "₱₱₱₱",
  5: "₱₱₱₱₱",
};

export default function FoodOutletDetailModal({
  outlet,
  open,
  onClose,
}: FoodOutletDetailModalProps) {
  const { user } = useAuthStore();
  const { reviews, isLoading, addReview, deleteReview } = useReviews(
    open && outlet ? outlet.id : null,
  );
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!outlet) return null;

  const handleAddReview = async (rating: number, summary: string) => {
    if (!user) return;

    await addReview(
      outlet.id,
      user.uid,
      user.displayName || "Anonymous",
      user.photoURL || undefined,
      { rating, summary },
    );
    setShowReviewForm(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId, outlet.id);
  };

  const handleGetDirections = () => {
    const { latitude, longitude } = outlet.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
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
          maxHeight: "90vh",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)",
          color: "white",
          p: 3,
          pb: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" fontWeight={700} sx={{ pr: 4 }}>
          {outlet.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Chip
            label={outlet.cuisine}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
          <Chip
            icon={
              <AttachMoneyIcon
                sx={{ color: "white !important", fontSize: 16 }}
              />
            }
            label={BUDGET_SYMBOLS[outlet.budget]}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
          {outlet.distance !== undefined && (
            <Chip
              icon={
                <LocationOnIcon
                  sx={{ color: "white !important", fontSize: 16 }}
                />
              }
              label={formatDistance(outlet.distance)}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
          <StarRating
            value={outlet.averageRating || 0}
            readonly
            size="small"
            showValue
            count={outlet.reviewCount}
          />
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Map */}
        <Box sx={{ height: 200 }}>
          <MapContainer
            center={[outlet.location.latitude, outlet.location.longitude]}
            zoom={16}
            markerPosition={[
              outlet.location.latitude,
              outlet.location.longitude,
            ]}
            height={200}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Address & Directions */}
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}
          >
            <LocationOnIcon color="action" sx={{ mt: 0.25 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2">{outlet.location.address}</Typography>
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
          {outlet.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {outlet.description}
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {outlet.tags && outlet.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {outlet.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Reviews Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Reviews ({outlet.reviewCount || 0})
            </Typography>
            {user && !userHasReviewed && !showReviewForm && (
              <Button
                size="small"
                startIcon={<RateReviewIcon />}
                onClick={() => setShowReviewForm(true)}
                sx={{ color: "primary.main" }}
              >
                Write Review
              </Button>
            )}
          </Box>

          <Collapse in={showReviewForm}>
            <Box sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
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
