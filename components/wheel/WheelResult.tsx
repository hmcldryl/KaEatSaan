'use client';

import React, { useState } from 'react';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Restaurant } from '@/types/restaurant';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import RestaurantDetailModal from '@/components/restaurant/RestaurantDetailModal';
import StarRating from '@/components/reviews/StarRating';

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
  const [detailOpen, setDetailOpen] = useState(false);

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
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 2,
          pt: 4,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography
          variant="body1"
          component="div"
          gutterBottom
          sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.875rem' }}
        >
          You're eating at...
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              color: '#980404',
              letterSpacing: '-0.02em',
            }}
          >
            {restaurant.name}
          </Typography>
          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              color: favorite ? '#980404' : '#6B7280',
              '&:hover': {
                background: 'rgba(152, 4, 4, 0.08)',
              },
            }}
          >
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              label={restaurant.cuisine}
              sx={{
                background: 'linear-gradient(135deg, #93BD57 0%, #A8CC72 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={getBudgetDisplay(restaurant.budget)}
              variant="outlined"
              sx={{ borderWidth: 2, fontWeight: 600, borderColor: '#980404', color: '#980404' }}
            />
            {restaurant.distance && (
              <Chip label={`${restaurant.distance.toFixed(1)} km`} variant="outlined" sx={{ borderWidth: 2, fontWeight: 600 }} />
            )}
          </Box>

          {(restaurant.averageRating || 0) > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <StarRating
                value={restaurant.averageRating || 0}
                readonly
                size="medium"
                showValue
                count={restaurant.reviewCount}
              />
            </Box>
          )}

          {restaurant.description && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.7 }}>
              {restaurant.description}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 500 }}>
            📍 {restaurant.location.address}
          </Typography>

          {restaurant.tags && restaurant.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
              {restaurant.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 2, flexWrap: 'wrap' }}>
        <Button
          onClick={() => setDetailOpen(true)}
          variant="text"
          size="large"
          startIcon={<InfoOutlinedIcon />}
          sx={{ color: 'text.secondary' }}
        >
          View Details
        </Button>
        <Button
          onClick={onSpinAgain}
          variant="outlined"
          size="large"
          sx={{
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Spin Again
        </Button>
        <Button onClick={onClose} variant="contained" size="large">
          Let's Go!
        </Button>
      </DialogActions>

      <RestaurantDetailModal
        restaurant={restaurant}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </Dialog>
  );
}
