"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import RouletteWheel from "@/components/wheel/RouletteWheel";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useUIStore } from "@/lib/store/uiStore";
import { useHistoryStore } from "@/lib/store/historyStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { Restaurant } from "@/types/restaurant";

export default function Home() {
  const { restaurants, isLoading, error } = useRestaurants();
  const { spinTrigger, setIsSpinning } = useUIStore();
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const handleSpinEnd = (restaurant: Restaurant) => {
    setIsSpinning(false);
    addHistoryEntry(restaurant, {
      budget: filters.budget,
      distance: filters.distance,
      cuisines: filters.cuisines,
      includeClosedRestaurants: filters.includeClosedRestaurants,
      onlyNewPlaces: filters.onlyNewPlaces,
      maxRestaurants: filters.maxRestaurants,
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 144px)",
          background:
            "linear-gradient(135deg, rgba(152, 4, 4, 0.03) 0%, rgba(147, 189, 87, 0.03) 50%, rgba(251, 229, 128, 0.03) 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              gap: 3,
            }}
          >
            <CircularProgress size={60} sx={{ color: "#980404" }} />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Loading restaurants...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 144px)",
          background:
            "linear-gradient(135deg, rgba(152, 4, 4, 0.03) 0%, rgba(147, 189, 87, 0.03) 50%, rgba(251, 229, 128, 0.03) 100%)",
        }}
      >
        <Container maxWidth="md">
          <Card
            sx={{
              mt: 4,
              p: 4,
              textAlign: "center",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#980404", fontWeight: 700, mb: 2 }}
            >
              Error loading restaurants
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // Account for top bar only
        background:
          "linear-gradient(135deg, rgba(152, 4, 4, 0.03) 0%, rgba(147, 189, 87, 0.03) 50%, rgba(251, 229, 128, 0.03) 100%)",
        position: 'relative',
      }}
    >
      {/* Text showing current restaurant - positioned above wheel */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 'calc(80px + 350px + 16px)', // Above wheel (80px nav + 350px wheel height + 16px gap)
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '600px',
          textAlign: 'center',
          zIndex: 901,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#980404',
            textShadow: '0 2px 8px rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: { xs: '8px 16px', sm: '12px 24px' },
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {currentRestaurant?.name || 'Tap to Spin!'}
        </Typography>
      </Box>

      {/* Wheel anchored at bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '80px', // Above bottom navigation
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '350px', // Show only top portion
          zIndex: 900,
          overflow: 'hidden',
        }}
      >
        {/* Wheel container - 133.33% width to show 75% */}
        <Box
          sx={{
            width: '133.33%',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <RouletteWheel
            restaurants={restaurants}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            onCurrentChange={setCurrentRestaurant}
            triggerSpin={spinTrigger > 0}
          />
        </Box>
      </Box>
    </Box>
  );
}
