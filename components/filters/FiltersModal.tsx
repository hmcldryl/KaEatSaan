'use client';

import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { BudgetLevel } from '@/types/foodOutlet';
import { CUISINES } from '@/lib/constants/foodOutlets';

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

  const maxOutletsMarks = [
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

  const handleMaxOutletsChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      filters.setMaxOutlets(newValue);
    }
  };

  const activeFiltersCount = filters.getActiveFiltersCount();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          borderRadius: '24px 24px 0 0',
          maxHeight: '90dvh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Drag handle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5, flexShrink: 0 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: '9999px', bgcolor: '#E5E7EB' }} />
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid #F3F4F6',
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Filters & Settings
        </Typography>
        {activeFiltersCount > 0 && (
          <Button
            onClick={filters.resetFilters}
            size="small"
            sx={{ color: '#6B7280', fontWeight: 600 }}
          >
            Reset all
          </Button>
        )}
      </Box>

      {/* Scrollable content */}
      <Box sx={{ overflowY: 'auto', flex: 1, px: 3, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2 }}>

          {/* Budget Filter */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Budget Range
            </Typography>
            <Box sx={{ px: 1, pt: 2 }}>
              <Slider
                value={filters.budget}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => '₱'.repeat(value)}
                min={1}
                max={4}
                step={1}
                marks={budgetMarks}
                sx={{ color: '#FF6B35' }}
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
              Show kainan within {filters.distance} km
            </Typography>
            <Box sx={{ px: 1, pt: 2 }}>
              <Slider
                value={filters.distance}
                onChange={handleDistanceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}km`}
                min={0.5}
                max={10}
                step={0.5}
                marks={distanceMarks}
                sx={{ color: '#FF6B35' }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Max Kainan */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Max Kainan
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Show up to {filters.maxOutlets} kainan in the wheel
            </Typography>
            <Box sx={{ px: 1, pt: 2 }}>
              <Slider
                value={filters.maxOutlets}
                onChange={handleMaxOutletsChange}
                valueLabelDisplay="auto"
                min={5}
                max={20}
                step={5}
                marks={maxOutletsMarks}
                sx={{ color: '#FF6B35' }}
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
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
                    checked={filters.includeClosedOutlets}
                    onChange={(e) => filters.setIncludeClosedOutlets(e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { bgcolor: '#FF6B35' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#FF6B35' } }}
                  />
                }
                label="Include closed kainan"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.onlyNewPlaces}
                    onChange={(e) => filters.setOnlyNewPlaces(e.target.checked)}
                    sx={{ '& .MuiSwitch-thumb': { bgcolor: '#FF6B35' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#FF6B35' } }}
                  />
                }
                label="Only show new places (added in last 30 days)"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #F3F4F6',
          flexShrink: 0,
          pb: 'max(env(safe-area-inset-bottom), 16px)',
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            height: 52,
            borderRadius: '9999px',
            backgroundColor: '#FF6B35',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)',
            '&:hover': { backgroundColor: '#E55A20' },
          }}
        >
          Done
        </Button>
      </Box>
    </SwipeableDrawer>
  );
}
