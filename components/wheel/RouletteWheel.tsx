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
  onCurrentChange?: (restaurant: Restaurant) => void;
  triggerSpin?: boolean;
}

export default function RouletteWheel({
  restaurants,
  onSpinStart,
  onSpinEnd,
  onCurrentChange,
  triggerSpin = false,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [lastTrigger, setLastTrigger] = useState(false);

  // Calculate current restaurant under pointer
  useEffect(() => {
    if (restaurants.length === 0) return;

    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const segmentAngle = 360 / restaurants.length;
    const adjustedRotation = (normalizedRotation + segmentAngle / 2) % 360;
    const segmentIndex = Math.floor(adjustedRotation / segmentAngle);
    const currentRestaurant = restaurants[segmentIndex];

    if (currentRestaurant && onCurrentChange) {
      onCurrentChange(currentRestaurant);
    }
  }, [rotation, restaurants, onCurrentChange]);

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

    // Check if click is within center circle
    // Button is 0.85 * wheel radius, and wheel radius is approximately (rect.width/2 - 70)
    const wheelRadius = (rect.width / 2 - 70);
    const centerRadius = wheelRadius * 0.85;

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
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          No restaurants match your filters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Try adjusting your filters to see more options
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '1/1',
        margin: '0 auto',
        cursor: isSpinning ? 'default' : 'pointer',
        position: 'relative',
      }}
      onClick={handleWheelClick}
    >
      <WheelCanvas restaurants={restaurants} rotation={rotation} size={600} />

      <WheelResult
        restaurant={result}
        open={!!result}
        onClose={handleCloseResult}
        onSpinAgain={handleSpinAgain}
      />
    </Box>
  );
}
