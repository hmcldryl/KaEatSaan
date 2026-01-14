'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Restaurant } from '@/types/restaurant';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

interface WheelResultProps {
  restaurant: Restaurant | null;
  open: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
}

export default function WheelResult({
  restaurant,
  open,
  onClose,
  onSpinAgain,
}: WheelResultProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  if (!restaurant) return null;

  const favorite = isFavorite(restaurant.id);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(restaurant.id);
    } else {
      addFavorite(restaurant.id);
    }
  };

  const getBudgetDisplay = (budget: number) => {
    return '₱'.repeat(budget);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          You're eating at...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 600 }}>
            {restaurant.name}
          </Typography>
          <IconButton onClick={handleToggleFavorite} color="primary">
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip label={restaurant.cuisine} color="secondary" />
            <Chip label={getBudgetDisplay(restaurant.budget)} color="primary" variant="outlined" />
            {restaurant.distance && (
              <Chip label={`${restaurant.distance.toFixed(1)} km`} variant="outlined" />
            )}
            {restaurant.rating && (
              <Chip label={`⭐ ${restaurant.rating}`} variant="outlined" />
            )}
          </Box>

          {restaurant.description && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {restaurant.description}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            📍 {restaurant.location.address}
          </Typography>

          {restaurant.tags && restaurant.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {restaurant.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button onClick={onSpinAgain} variant="outlined" size="large">
          Spin Again
        </Button>
        <Button onClick={onClose} variant="contained" size="large">
          Let's Go!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
