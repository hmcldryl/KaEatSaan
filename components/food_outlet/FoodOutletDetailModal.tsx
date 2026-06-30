"use client";

import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FoodOutlet } from "@/types/foodOutlet";
import OutletDetailContent from "@/components/food_outlet/OutletDetailContent";

interface FoodOutletDetailModalProps {
  outlet: FoodOutlet | null;
  open: boolean;
  onClose: () => void;
}

export default function FoodOutletDetailModal({ outlet, open, onClose }: FoodOutletDetailModalProps) {
  if (!outlet) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", maxHeight: "90dvh", mx: 0.5, bgcolor: "#FFFFFF" } }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, color: "#9CA3AF", "&:hover": { color: "#6B7280", bgcolor: "#F3F4F6" } }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <OutletDetailContent outlet={outlet} active={open} showEdit={false} showHistory={false} />
      </DialogContent>
    </Dialog>
  );
}
