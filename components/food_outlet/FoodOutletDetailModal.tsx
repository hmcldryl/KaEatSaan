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
import { useLocationStore } from "@/lib/store/locationStore";

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
  const { location: userGeoLocation } = useLocationStore();
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
          borderRadius: "16px",
          maxHeight: "90vh",
          mx: 0.5,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "#FF6B35",
          color: "white",
          p: 4,
          pb: 1.25,
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

        <Typography fontWeight={600} sx={{ pr: 4, fontSize: "0.9rem", lineHeight: 1.2 }}>
          {outlet.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Chip
            label={outlet.cuisine}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 400,
            }}
          />
          <Chip
            label={BUDGET_SYMBOLS[outlet.budget]}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 400,
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
                fontWeight: 400,
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
            starColor="#fff"
            textColor="#eee"
          />
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Map */}
        <Box sx={{ height: 160 }}>
          <MapContainer
            center={[outlet.location.latitude, outlet.location.longitude]}
            zoom={16}
            markerPosition={[outlet.location.latitude, outlet.location.longitude]}
            height={160}
            userLocation={userGeoLocation ? [userGeoLocation.latitude, userGeoLocation.longitude] : undefined}
          />
        </Box>

        <Box sx={{ p: 1.5 }}>
          {/* Address & Directions */}
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mb: 1 }}
          >
            <LocationOnIcon color="action" sx={{ mt: 0.25, fontSize: 16 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.72rem", lineHeight: 1.3 }}>{outlet.location.address}</Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DirectionsIcon sx={{ fontSize: "14px !important" }} />}
              onClick={handleGetDirections}
              sx={{ fontSize: "0.72rem", whiteSpace: "nowrap" }}
            >
              Directions
            </Button>
          </Box>

          {/* Description */}
          {outlet.description && (
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: "0.72rem", lineHeight: 1.3 }} color="text.secondary">
                {outlet.description}
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {outlet.tags && outlet.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {outlet.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.68rem", height: 20 }} />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Reviews Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography fontWeight={700} sx={{ fontSize: "0.82rem" }}>
              Reviews ({outlet.reviewCount || 0})
            </Typography>
            {user && !userHasReviewed && !showReviewForm && (
              <Button
                size="small"
                startIcon={<RateReviewIcon sx={{ fontSize: "14px !important" }} />}
                onClick={() => setShowReviewForm(true)}
                sx={{ color: "primary.main", fontSize: "0.72rem" }}
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
