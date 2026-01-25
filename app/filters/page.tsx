'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { useFoodOutletStore } from '@/lib/store/foodOutletStore';
import { CUISINES } from '@/lib/constants/foodOutlets';
import { BudgetLevel } from '@/types/foodOutlet';

export default function FiltersPage() {
  const {
    budget,
    distance,
    cuisines,
    includeClosedOutlets,
    onlyNewPlaces,
    setBudget,
    setDistance,
    toggleCuisine,
    setIncludeClosedOutlets,
    setOnlyNewPlaces,
    resetFilters,
    getActiveFiltersCount,
  } = useFiltersStore();

  const filteredOutlets = useFoodOutletStore((state) => state.filteredOutlets);

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

  const handleBudgetChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setBudget([newValue[0] as BudgetLevel, newValue[1] as BudgetLevel]);
    }
  };

  const handleDistanceChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setDistance(newValue);
    }
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Filters & Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredOutlets.length} outlet{filteredOutlets.length !== 1 ? 's' : ''} match
              {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active)`}
            </Typography>
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="outlined" size="small" onClick={resetFilters}>
              Reset All
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Budget Filter */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Budget Range
            </Typography>
            <Box sx={{ px: 2, pt: 2 }}>
              <Slider
                value={budget}
                onChange={handleBudgetChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => '₱'.repeat(value)}
                min={1}
                max={4}
                step={1}
                marks={budgetMarks}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Distance Filter */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Distance
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Show places within {distance} km
            </Typography>
            <Box sx={{ px: 2, pt: 2 }}>
              <Slider
                value={distance}
                onChange={handleDistanceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}km`}
                min={0.5}
                max={10}
                step={0.5}
                marks={distanceMarks}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>

          <Divider />

          {/* Cuisine Filter */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Cuisine Types
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {cuisines.length === 0
                ? 'All cuisines selected'
                : `${cuisines.length} cuisine${cuisines.length !== 1 ? 's' : ''} selected`}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {CUISINES.map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  color={cuisines.includes(cuisine) ? 'primary' : 'default'}
                  variant={cuisines.includes(cuisine) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Other Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Other Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeClosedOutlets}
                    onChange={(e) => setIncludeClosedOutlets(e.target.checked)}
                  />
                }
                label="Include closed places"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={onlyNewPlaces}
                    onChange={(e) => setOnlyNewPlaces(e.target.checked)}
                  />
                }
                label="Only show new places (added in last 30 days)"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
