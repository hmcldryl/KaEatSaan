"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Badge from "@mui/material/Badge";
import RouletteWheel from "@/components/wheel/RouletteWheel";
import { useFoodOutlets } from "@/hooks/useFoodOutlets";
import { useUIStore } from "@/lib/store/uiStore";
import { useHistoryStore } from "@/lib/store/historyStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { FoodOutlet } from "@/types/foodOutlet";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";
import FiltersModal from "@/components/filters/FiltersModal";
import { useRouter } from "next/navigation";

export default function Home() {
  const { outlets, isLoading } = useFoodOutlets();
  const { setIsSpinning } = useUIStore();
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();
  const activeFiltersCount = useFiltersStore((state) => state.getActiveFiltersCount());
  const { user } = useAuthStore();
  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const router = useRouter();

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

  const handleSpin = () => {
    setSpinTrigger((prev) => prev + 1);
  };

  const hasFoodOutlets = outlets.length > 0;

  // White dots for the decorative elements
  const dots = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 144px)",
        backgroundColor: "#FAF9F7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 1,
        pb: 2,
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

      {/* Empty state message */}
      {!isLoading && !hasFoodOutlets && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 4,
            textAlign: "center",
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
            Add your favorite kainan!
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
              Sign in to add your favorite kainan
            </Typography>
          )}
        </Box>
      )}

      {/* Current segment banner - styled like wheel outer ring */}
      {hasFoodOutlets && (
        <Box
          sx={{
            width: "90%",
            maxWidth: "500px",
            mx: "auto",
            mb: 0,
            position: "relative",
            background: "linear-gradient(90deg, #FFE4A3 0%, #FFD966 50%, #FFE4A3 100%)",
            borderRadius: "50px",
            padding: "14px 24px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
            border: "2px solid #FFCC33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Decorative dots - left side */}
          <Box
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              gap: "6px",
            }}
          >
            {dots.slice(0, 3).map((i) => (
              <Box
                key={`left-${i}`}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </Box>

          {/* Text */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1F2937",
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "70%",
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            {currentOutlet?.name || "Tap Saan?"}
          </Typography>

          {/* Decorative dots - right side */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              gap: "6px",
            }}
          >
            {dots.slice(0, 3).map((i) => (
              <Box
                key={`right-${i}`}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Wheel */}
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          mt: -1,
        }}
      >
        <Box
          sx={{
            width: { xs: "130%", sm: "100%" },
            maxWidth: { xs: "none", sm: "600px" },
            margin: "0 auto",
            position: "relative",
            left: { xs: "50%", sm: "0" },
            transform: { xs: "translateX(-50%)", sm: "none" },
          }}
        >
          <RouletteWheel
            outlets={outlets}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            onCurrentChange={setCurrentOutlet}
            triggerSpin={spinTrigger > 0 ? spinTrigger : undefined}
          />
        </Box>
      </Box>

      {/* Button group - circus styled */}
      {hasFoodOutlets && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            mt: -2,
            position: "relative",
            background: "linear-gradient(90deg, #FFE4A3 0%, #FFD966 50%, #FFE4A3 100%)",
            borderRadius: "50px",
            padding: "6px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
            border: "2px solid #FFCC33",
          }}
        >
          {/* Filter button */}
          <IconButton
            onClick={() => setFiltersModalOpen(true)}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#6B7280",
              width: 48,
              height: 48,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#FFF5F0",
                color: "#FF6B35",
              },
            }}
          >
            <Badge
              badgeContent={activeFiltersCount}
              sx={{
                "& .MuiBadge-badge": {
                  background: "#FF6B35",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <TuneIcon />
            </Badge>
          </IconButton>

          {/* Saan? button */}
          <Button
            onClick={handleSpin}
            variant="contained"
            sx={{
              backgroundColor: "#FF6B35",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              mx: 1,
              borderRadius: "50px",
              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
              "&:hover": {
                backgroundColor: "#E55A2B",
              },
            }}
          >
            Saan?
          </Button>

          {/* Favorites button */}
          <IconButton
            onClick={() => router.push("/favorites")}
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#6B7280",
              width: 48,
              height: 48,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#FFF5F0",
                color: "#FF6B35",
              },
            }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      )}

      <AddFoodOutletModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <FiltersModal
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
      />
    </Box>
  );
}
