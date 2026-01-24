'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { BudgetLevel } from '@/types/restaurant';
import { CUISINES } from '@/lib/constants/cuisines';

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FiltersModal({ open, onClose }: FiltersModalProps) {
  const filters = useFiltersStore();

  const budgetMarks = [
    { value: 1, label: '₱' },
    { value: 2, label: '₱₱' },
    { value: 3, label: '₱₱₱' },
    { value: 4, label: '₱₱₱₱' },
  ];

  const distanceMarks = [
    { value: 0.5, label: '0.5km' },
    { value: 2, label: '2km' },
    { value: 5, label: '5km' },
    { value: 10, label: '10km' },
  ];

  const maxRestaurantsMarks = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

  const handleBudgetChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      filters.setBudget([newValue[0] as BudgetLevel, newValue[1] as BudgetLevel]);
    }
  };

  const handleDistanceChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      filters.setDistance(newValue);
    }
  };

  const handleMaxRestaurantsChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      filters.setMaxRestaurants(newValue);
    }
  };

  const activeFiltersCount = filters.getActiveFiltersCount();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #980404 0%, #B91C1C 100%)',
          color: 'white',
          py: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
            Filters & Settings
          </Typography>
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.15)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          {/* Budget Filter */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Budget Range
            </Typography>
            <Box sx={{ px: 2, pt: 2 }}>
              <Slider
                value={filters.budget}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => '₱'.repeat(value)}
                min={1}
                max={4}
                step={1}
                marks={budgetMarks}
              />
            </Box>
          </Box>

          <Divider />

          {/* Distance Filter */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Distance
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Show restaurants within {filters.distance} km
            </Typography>
            <Box sx={{ px: 2, pt: 2 }}>
              <Slider
                value={filters.distance}
                onChange={handleDistanceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}km`}
                min={0.5}
                max={10}
                step={0.5}
                marks={distanceMarks}
              />
            </Box>
          </Box>

          <Divider />

          {/* Max Restaurants Filter */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Max Restaurants
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Show up to {filters.maxRestaurants} restaurants in the wheel
            </Typography>
            <Box sx={{ px: 2, pt: 2 }}>
              <Slider
                value={filters.maxRestaurants}
                onChange={handleMaxRestaurantsChange}
                valueLabelDisplay="auto"
                min={5}
                max={20}
                step={5}
                marks={maxRestaurantsMarks}
              />
            </Box>
          </Box>

          <Divider />

          {/* Cuisine Filter */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Cuisine Types
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {filters.cuisines.length === 0
                ? 'All cuisines selected'
                : `${filters.cuisines.length} cuisine${filters.cuisines.length !== 1 ? 's' : ''} selected`}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {CUISINES.map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  onClick={() => filters.toggleCuisine(cuisine)}
                  color={filters.cuisines.includes(cuisine) ? 'primary' : 'default'}
                  variant={filters.cuisines.includes(cuisine) ? 'filled' : 'outlined'}
                  size="medium"
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Other Settings */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Other Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.includeClosedRestaurants}
                    onChange={(e) => filters.setIncludeClosedRestaurants(e.target.checked)}
                  />
                }
                label="Include closed restaurants"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.onlyNewPlaces}
                    onChange={(e) => filters.setOnlyNewPlaces(e.target.checked)}
                  />
                }
                label="Only show new places (added in last 30 days)"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {activeFiltersCount > 0 && (
          <Button onClick={filters.resetFilters} sx={{ mr: 'auto' }}>
            Reset All
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
