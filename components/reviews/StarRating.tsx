'use client';

import { Box, IconButton, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  count?: number;
  starColor?: string;
  textColor?: string;
}

const sizeMap = {
  small: 18,
  medium: 24,
  large: 32,
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'medium',
  showValue = false,
  count,
  starColor,
  textColor = 'text.secondary',
}: StarRatingProps) {
  const iconSize = sizeMap[size];

  const handleClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = value >= starValue;
    const halfFilled = value >= starValue - 0.5 && value < starValue;

    const StarComponent = filled ? StarIcon : halfFilled ? StarHalfIcon : StarBorderIcon;

    const activeColor = starColor || 'warning.main';
    const inactiveColor = starColor || 'grey.400';

    if (readonly) {
      return (
        <StarComponent
          key={index}
          sx={{
            fontSize: iconSize,
            color: filled || halfFilled ? activeColor : inactiveColor,
          }}
        />
      );
    }

    return (
      <IconButton
        key={index}
        onClick={() => handleClick(starValue)}
        size="small"
        sx={{
          p: 0.25,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <StarComponent
          sx={{
            fontSize: iconSize,
            color: filled ? activeColor : inactiveColor,
            transition: 'color 0.2s',
            '&:hover': {
              color: activeColor,
            },
          }}
        />
      </IconButton>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </Box>
      {showValue && (
        <Typography
          variant="body2"
          sx={{ 
            ml: 0.5, 
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            color: textColor
          }}
        >
          {value.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </Typography>
      )}
    </Box>
  );
}