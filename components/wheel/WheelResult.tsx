"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { FoodOutlet } from "@/types/foodOutlet";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import FoodOutletDetailModal from "@/components/food_outlet/FoodOutletDetailModal";
import StarRating from "@/components/reviews/StarRating";

interface WheelResultProps {
  outlet: FoodOutlet | null;
  open: boolean;
  onClose: () => void;
  onSpinAgain: (removeOutlet?: boolean) => void;
}

export default function WheelResult({
  outlet,
  open,
  onClose,
  onSpinAgain,
}: WheelResultProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [detailOpen, setDetailOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  if (!outlet) return null;

  const favorite = isFavorite(outlet.id);

  const handleToggleFavorite = () => {
    if (favorite) removeFavorite(outlet.id);
    else addFavorite(outlet.id);
  };

  const handleSpinAgainClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = (remove: boolean) => {
    setShowRemoveConfirm(false);
    onSpinAgain(remove);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          mx: 0.5,
          bgcolor: "#FFFFFF",
        },
      }}
    >
      {/* X close button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "#9CA3AF",
          "&:hover": { color: "#6B7280", bgcolor: "#F3F4F6" },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", pt: 2.5, pb: 1, px: 5 }}>
        <Typography sx={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.5 }}>
          You&apos;re eating at...
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#FF6B35", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {outlet.name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 0.5, px: 2.5 }}>
        {showRemoveConfirm ? (
          <Box sx={{ textAlign: "center", py: 1 }}>
            <Typography sx={{ fontSize: "0.82rem", color: "#374151", fontWeight: 600, mb: 0.5 }}>
              Remove from the wheel?
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 2 }}>
              <strong>{outlet.name}</strong> won&apos;t appear this session.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleConfirmRemove(false)}
                sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.75rem", borderColor: "#E5E7EB", color: "#6B7280" }}
              >
                Keep it
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleConfirmRemove(true)}
                sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.75rem", bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" } }}
              >
                Yes, remove
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", justifyContent: "center" }}>
              {outlet.classification && (
                <Chip
                  label={outlet.classification}
                  size="small"
                  sx={{ bgcolor: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: "0.72rem", height: 24 }}
                />
              )}
              <Chip
                label={outlet.cuisine}
                size="small"
                sx={{ bgcolor: "#FF6B35", color: "#fff", fontWeight: 600, fontSize: "0.72rem", height: 24 }}
              />
              <Chip
                label={"₱".repeat(outlet.budget)}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24, borderColor: "#E5E7EB" }}
              />
              {outlet.distance && (
                <Chip
                  label={`${outlet.distance.toFixed(1)} km`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: "0.72rem", height: 24 }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {(outlet.averageRating || 0) > 0
                ? <StarRating value={outlet.averageRating || 0} readonly size="small" showValue count={outlet.reviewCount} />
                : <Typography sx={{ fontSize: "0.7rem", color: "#D1D5DB", fontStyle: "italic" }}>No reviews yet</Typography>
              }
            </Box>

            <Typography sx={{ textAlign: "center", fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 500 }}>
              📍 {outlet.location.address}
            </Typography>

            {outlet.description && (
              <Typography sx={{ textAlign: "center", fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.4 }}>
                {outlet.description}
              </Typography>
            )}

            {outlet.tags && outlet.tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
                {outlet.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.68rem", height: 20, fontWeight: 500 }} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      {!showRemoveConfirm && (
        <DialogActions sx={{ flexDirection: "column", pb: 2.5, px: 2, pt: 0, gap: 1, alignItems: "stretch" }}>
          {/* Details – text, no outline, above */}
          <Button
            onClick={() => setDetailOpen(true)}
            variant="text"
            startIcon={<InfoOutlinedIcon sx={{ fontSize: "14px !important" }} />}
            sx={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.72rem", alignSelf: "center", py: 0.25 }}
          >
            Details
          </Button>
          {/* Spin Again + Fave circle – same row */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              onClick={handleSpinAgainClick}
              variant="outlined"
              fullWidth
              sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.75rem", borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } }}
            >
              Spin Again
            </Button>
            <IconButton
              onClick={handleToggleFavorite}
              sx={{ width: 40, height: 40, flexShrink: 0, border: "1.5px solid", borderColor: favorite ? "rgba(227,119,37,0.5)" : "#E5E7EB", color: favorite ? "#FF6B35" : "#9CA3AF", "&:hover": { bgcolor: "rgba(255,107,53,0.04)" } }}
            >
              {favorite ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
          {/* Let's Go – full width */}
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{ borderRadius: "9999px", fontWeight: 700, fontSize: "0.78rem", bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" } }}
          >
            Let&apos;s Go!
          </Button>
        </DialogActions>
      )}

      <FoodOutletDetailModal outlet={outlet} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </Dialog>
  );
}
