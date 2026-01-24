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
    <Box sx={{ py: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Write a Review
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your rating
        </Typography>
        <StarRating value={rating} onChange={setRating} size="large" />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Share your experience..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        sx={{ mb: 2 }}
        helperText={`${summary.length}/500 characters`}
        error={summary.length > 500}
      />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !summary.trim()}
          sx={{
            background: 'linear-gradient(135deg, #980404 0%, #c41e1e 100%)',
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Review'}
        </Button>
      </Box>
    </Box>
  );
}
