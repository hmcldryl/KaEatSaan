'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { useRestaurantStore } from '@/lib/store/restaurantStore';
import { useEffect } from 'react';

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const { restaurants, loadRestaurants } = useRestaurantStore();

  useEffect(() => {
    if (restaurants.length === 0) {
      loadRestaurants();
    }
  }, [restaurants.length, loadRestaurants]);

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  const getBudgetDisplay = (budget: number) => {
    return '₱'.repeat(budget);
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: 2,
          }}
        >
          <FavoriteIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h5" color="text.secondary">
            No Suki Places Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start spinning the wheel and add your favorite restaurants!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Suki Places
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {favorites.length} favorite restaurant{favorites.length !== 1 ? 's' : ''}
            </Typography>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={clearFavorites}
            >
              Clear All
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {favoriteRestaurants.map((restaurant) => (
            <Card key={restaurant.id} sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {restaurant.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label={restaurant.cuisine} size="small" color="secondary" />
                      <Chip
                        label={getBudgetDisplay(restaurant.budget)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {restaurant.distance && (
                        <Chip
                          label={`${restaurant.distance.toFixed(1)} km`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {restaurant.rating && (
                        <Chip
                          label={`⭐ ${restaurant.rating}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {restaurant.location.address}
                    </Typography>

                    {restaurant.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {restaurant.description}
                      </Typography>
                    )}

                    {restaurant.tags && restaurant.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                        {restaurant.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <IconButton
                    aria-label="remove from favorites"
                    onClick={() => removeFavorite(restaurant.id)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
