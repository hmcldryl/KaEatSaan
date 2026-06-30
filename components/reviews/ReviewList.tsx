'use client';

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Review } from '@/types/review';
import { useAuthStore } from '@/lib/store/authStore';
import StarRating from './StarRating';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  onDelete?: (reviewId: string) => void;
  currentUserName?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export default function ReviewList({ reviews, isLoading, onDelete, currentUserName }: ReviewListProps) {
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
          No reviews yet. Be the first to review!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {reviews.map((review, index) => (
        <Box key={review.id}>
          <Box sx={{ py: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Avatar
                src={review.userPhotoUrl || undefined}
                alt={review.userName}
                sx={{ width: 28, height: 28, bgcolor: '#FF6B35', fontSize: '0.7rem' }}
              >
                {(user?.uid === review.userId && currentUserName ? currentUserName : review.userName)[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', lineHeight: 1.2 }}>
                      {user?.uid === review.userId && currentUserName ? currentUserName : review.userName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                      <StarRating value={review.rating} readonly size="small" />
                      <Typography sx={{ fontSize: '0.65rem', color: '#9CA3AF' }}>
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  {user?.uid === review.userId && onDelete && (
                    <IconButton
                      size="small"
                      onClick={() => onDelete(review.id)}
                      color="error"
                      sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#6B7280', lineHeight: 1.4, mt: 0.5 }}>
                  {review.summary}
                </Typography>
              </Box>
            </Box>
          </Box>
          {index < reviews.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
}
