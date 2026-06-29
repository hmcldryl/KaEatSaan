'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '@/lib/store/authStore';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (rating: number, summary: string) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Please sign in to leave a review.
      </Alert>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!summary.trim()) {
      setError('Please write a review');
      return;
    }
    if (summary.length > 500) {
      setError('Review must be 500 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(rating, summary.trim());
      setRating(0);
      setSummary('');
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 0 }}>
      <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', mb: 1 }}>
        Write a Review
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1, fontSize: '0.72rem', py: 0.5 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 1.25 }}>
        <Typography sx={{ fontSize: '0.68rem', color: '#9CA3AF', mb: 0.5 }}>
          Your rating
        </Typography>
        <StarRating value={rating} onChange={setRating} size="small" />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Share your experience..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        sx={{
          mb: 1.25,
          '& .MuiInputBase-input': { fontSize: '0.75rem' },
          '& .MuiFormHelperText-root': { fontSize: '0.65rem', mx: 0 },
        }}
        helperText={`${summary.length}/500`}
        error={summary.length > 500}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: '9999px', fontWeight: 700, fontSize: '0.72rem', borderColor: '#E5E7EB', color: '#6B7280', borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } }}
          >
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !summary.trim()}
          sx={{ borderRadius: '9999px', fontWeight: 700, fontSize: '0.72rem', bgcolor: '#FF6B35', '&:hover': { bgcolor: '#E55A20' } }}
        >
          {isSubmitting ? <CircularProgress size={16} color="inherit" /> : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
}
