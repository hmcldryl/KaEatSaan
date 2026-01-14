'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WheelCanvas from './WheelCanvas';
import WheelResult from './WheelResult';
import { Restaurant } from '@/types/restaurant';
import {
  animateWheel,
  generateFinalRotation,
  calculateWinner,
} from '@/lib/utils/wheelAnimation';

interface RouletteWheelProps {
  restaurants: Restaurant[];
  onSpinStart?: () => void;
  onSpinEnd?: (restaurant: Restaurant) => void;
  triggerSpin?: boolean;
}

export default function RouletteWheel({
  restaurants,
  onSpinStart,
  onSpinEnd,
  triggerSpin = false,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [lastTrigger, setLastTrigger] = useState(false);

  const spin = useCallback(() => {
    if (isSpinning || restaurants.length === 0) return;

    setIsSpinning(true);
    onSpinStart?.();

    // Select random target
    const targetIndex = Math.floor(Math.random() * restaurants.length);
    const finalRotation = generateFinalRotation(targetIndex, restaurants.length);

    const startTime = performance.now();
    const duration = 3500; // 3.5 seconds
    const startRotation = rotation % 360;

    animateWheel(
      startTime,
      duration,
      startRotation,
      startRotation + finalRotation,
      (currentRotation) => {
        setRotation(currentRotation);
      },
      () => {
        const winner = calculateWinner(rotation + finalRotation, restaurants);
        setResult(winner);
        setIsSpinning(false);
        onSpinEnd?.(winner);
      }
    );
  }, [isSpinning, restaurants, rotation, onSpinStart, onSpinEnd]);

  // Handle external spin trigger
  useEffect(() => {
    if (triggerSpin !== lastTrigger) {
      if (triggerSpin && !isSpinning) {
        spin();
      }
      setLastTrigger(triggerSpin);
    }
  }, [triggerSpin, lastTrigger, isSpinning, spin]);

  const handleCloseResult = () => {
    setResult(null);
  };

  const handleSpinAgain = () => {
    setResult(null);
    setTimeout(() => {
      spin();
    }, 300);
  };

  const handleWheelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isSpinning || restaurants.length === 0) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Get click position relative to the element
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Calculate distance from center
    const dx = clickX - centerX;
    const dy = clickY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if click is within center circle (radius ~50px scaled to container)
    const centerRadius = 50 * (rect.width / 400); // Scale based on actual size

    if (distance <= centerRadius) {
      spin();
    }
  };

  if (restaurants.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          p: 4,
        }}
      >
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No restaurants match your filters.
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
          Try adjusting your filters to see more options.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        cursor: isSpinning ? 'default' : 'pointer',
      }}
      onClick={handleWheelClick}
    >
      <WheelCanvas restaurants={restaurants} rotation={rotation} size={400} />

      <WheelResult
        restaurant={result}
        open={!!result}
        onClose={handleCloseResult}
        onSpinAgain={handleSpinAgain}
      />
    </Box>
  );
}
