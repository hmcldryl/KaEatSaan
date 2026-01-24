'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CuisineType, BudgetLevel, Location } from '@/types/restaurant';
import { CUISINES } from '@/lib/constants/cuisines';
import { useRestaurantStore } from '@/lib/store/restaurantStore';
import { useAuthStore } from '@/lib/store/authStore';
import LocationPicker from '@/components/map/LocationPicker';

interface AddRestaurantModalProps {
  open: boolean;
  onClose: () => void;
}

const BUDGET_LABELS: Record<BudgetLevel, string> = {
  1: '₱ - Budget Friendly',
  2: '₱₱ - Moderate',
  3: '₱₱₱ - Upscale',
  4: '₱₱₱₱ - Fine Dining',
};

export default function AddRestaurantModal({ open, onClose }: AddRestaurantModalProps) {
  const { addRestaurant } = useRestaurantStore();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState<CuisineType>('Filipino');
  const [budget, setBudget] = useState<BudgetLevel>(2);
  const [location, setLocation] = useState<Location | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setCuisine('Filipino');
    setBudget(2);
    setLocation(null);
    setDescription('');
    setTags([]);
    setTagInput('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter a restaurant name');
      return;
    }
    if (!location) {
      setError('Please select a location on the map');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newRestaurant = {
        name: name.trim(),
        cuisine,
        budget,
        location,
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        isOpen: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid,
        reviewCount: 0,
        averageRating: 0,
      };

      const id = await addRestaurant(newRestaurant);

      if (id) {
        handleClose();
      } else {
        setError('Failed to add restaurant. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #980404 0%, #c41e1e 100%)',
          color: 'white',
          py: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Add New Restaurant
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Restaurant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            placeholder="e.g., Jollibee, Mang Inasal"
          />

          <FormControl fullWidth>
            <InputLabel>Cuisine Type</InputLabel>
            <Select
              value={cuisine}
              label="Cuisine Type"
              onChange={(e) => setCuisine(e.target.value as CuisineType)}
            >
              {CUISINES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Budget Level</InputLabel>
            <Select
              value={budget}
              label="Budget Level"
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
            >
              {([1, 2, 3, 4] as BudgetLevel[]).map((b) => (
                <MenuItem key={b} value={b}>
                  {BUDGET_LABELS[b]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Location *
            </Typography>
            <LocationPicker value={location} onChange={setLocation} height={250} />
          </Box>

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="Brief description of the restaurant..."
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              Tags (optional, max 5)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a tag..."
                disabled={tags.length >= 5}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                size="small"
              >
                Add
              </Button>
            </Box>
            {tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            background: 'linear-gradient(135deg, #980404 0%, #c41e1e 100%)',
            px: 4,
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Add Restaurant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
