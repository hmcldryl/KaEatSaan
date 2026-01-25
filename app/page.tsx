"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import RouletteWheel from "@/components/wheel/RouletteWheel";
import { useFoodOutlets } from "@/hooks/useFoodOutlets";
import { useUIStore } from "@/lib/store/uiStore";
import { useHistoryStore } from "@/lib/store/historyStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { FoodOutlet } from "@/types/foodOutlet";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";

export default function Home() {
  const { outlets, isLoading } = useFoodOutlets();
  const { spinTrigger, setIsSpinning } = useUIStore();
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();
  const { user } = useAuthStore();
  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const handleSpinEnd = (outlet: FoodOutlet) => {
    setIsSpinning(false);
    addHistoryEntry(outlet, {
      budget: filters.budget,
      distance: filters.distance,
      classifications: filters.classifications,
      cuisines: filters.cuisines,
      includeClosedOutlets: filters.includeClosedOutlets,
      onlyNewPlaces: filters.onlyNewPlaces,
      maxOutlets: filters.maxOutlets,
    });
  };

  const hasFoodOutlets = outlets.length > 0;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#FAF9F7",
        position: "relative",
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            bottom: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(250, 249, 247, 0.9)",
            zIndex: 1100,
            gap: 2,
          }}
        >
          <CircularProgress size={48} sx={{ color: "#FF6B35" }} />
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}

      {/* Empty state message - shown above wheel when no kainan */}
      {!isLoading && !hasFoodOutlets && (
        <Box
          sx={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            bottom: "calc(80px + 350px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            textAlign: "center",
            zIndex: 901,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              mb: 1,
            }}
          >
            No Kainan Yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 280 }}
          >
            Add your favorite food places to start spinning!
          </Typography>
          {user ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{
                backgroundColor: "#FF6B35",
                "&:hover": { backgroundColor: "#E55A2B" },
              }}
            >
              Add Kainan
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sign in to add food places
            </Typography>
          )}
        </Box>
      )}

      {/* Text showing current kainan - positioned above wheel */}
      {hasFoodOutlets && (
        <Box
          sx={{
            position: "fixed",
            bottom: "calc(80px + 350px + 16px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "600px",
            textAlign: "center",
            zIndex: 901,
            px: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#FF6B35",
              fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2rem" },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: { xs: "8px 16px", sm: "12px 24px" },
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentOutlet?.name || "Tap to Spin!"}
          </Typography>
        </Box>
      )}

      {/* Wheel - always visible */}
      <Box
        sx={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "350px",
          zIndex: 900,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "133.33%",
            maxWidth: "800px",
            margin: "0 auto",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <RouletteWheel
            outlets={outlets}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            onCurrentChange={setCurrentOutlet}
            triggerSpin={spinTrigger > 0}
          />
        </Box>
      </Box>

      <AddFoodOutletModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Box>
  );
}
