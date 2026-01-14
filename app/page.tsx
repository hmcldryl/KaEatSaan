'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import RouletteWheel from '@/components/wheel/RouletteWheel';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useUIStore } from '@/lib/store/uiStore';
import { useHistoryStore } from '@/lib/store/historyStore';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { Restaurant } from '@/types/restaurant';

export default function Home() {
  const { restaurants, isLoading, error } = useRestaurants();
  const { spinTrigger, setIsSpinning } = useUIStore();
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const filters = useFiltersStore();

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
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading restaurants...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading restaurants
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Saan tayo kakain? 🍜
          </Typography>
        </Box>

        <RouletteWheel
          restaurants={restaurants}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          triggerSpin={spinTrigger > 0}
        />

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} available
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
