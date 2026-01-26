"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import WheelCanvas from "./WheelCanvas";
import WheelResult from "./WheelResult";
import { FoodOutlet } from "@/types/foodOutlet";
import { animateWheel } from "@/lib/utils/wheelAnimation";

interface RouletteWheelProps {
  outlets: FoodOutlet[];
  onSpinStart?: () => void;
  onSpinEnd?: (outlet: FoodOutlet) => void;
  onCurrentChange?: (outlet: FoodOutlet) => void;
  triggerSpin?: boolean;
}

// Helper to get segment under pointer for a given rotation
function getSegmentAtPointer(rotation: number, outlets: FoodOutlet[]): FoodOutlet | null {
  if (outlets.length === 0) return null;

  const segmentCount = outlets.length;
  const segmentAngle = 360 / segmentCount;
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  // Segment i appears at screen angle: (i * segmentAngle - 90 + rotation)
  // Pointer is at 270 degrees (top)
  // Solve for i: i * segmentAngle - 90 + rotation = 270
  // i = (360 - rotation) / segmentAngle
  const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segmentCount;

  return outlets[segmentIndex] || null;
}

export default function RouletteWheel({
  outlets,
  onSpinStart,
  onSpinEnd,
  onCurrentChange,
  triggerSpin = false,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<FoodOutlet | null>(null);
  const [lastTrigger, setLastTrigger] = useState(false);

  // Track current segment during spin
  const currentSegmentRef = useRef<FoodOutlet | null>(null);

  // Calculate current restaurant under pointer
  useEffect(() => {
    const current = getSegmentAtPointer(rotation, outlets);
    currentSegmentRef.current = current;

    if (current && onCurrentChange) {
      onCurrentChange(current);
    }
  }, [rotation, outlets, onCurrentChange]);

  const spin = useCallback(() => {
    if (isSpinning || outlets.length === 0) return;

    setIsSpinning(true);
    onSpinStart?.();

    // Random rotation: 3-5 full spins plus random angle
    const fullSpins = (3 + Math.random() * 2) * 360;
    const randomAngle = Math.random() * 360;
    const totalRotation = fullSpins + randomAngle;

    const startTime = performance.now();
    const duration = 3500; // 3.5 seconds
    const startRotation = rotation % 360;

    animateWheel(
      startTime,
      duration,
      startRotation,
      startRotation + totalRotation,
      (currentRotation) => {
        setRotation(currentRotation);
      },
      (finalRotation) => {
        // Calculate winner directly from the final rotation value
        const winner = getSegmentAtPointer(finalRotation, outlets);
        if (winner) {
          setResult(winner);
          onSpinEnd?.(winner);
        }
        setIsSpinning(false);
      },
    );
  }, [isSpinning, outlets, rotation, onSpinStart, onSpinEnd]);

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
    if (isSpinning || outlets.length === 0) return;

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
    const wheelRadius = rect.width / 2 - 70;
    const centerRadius = wheelRadius * 0.85;

    if (distance <= centerRadius) {
      spin();
    }
  };

  const isEmpty = outlets.length === 0;

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "1/1",
        margin: "0 auto",
        cursor: isSpinning || isEmpty ? "default" : "pointer",
        position: "relative",
      }}
      onClick={isEmpty ? undefined : handleWheelClick}
    >
      <WheelCanvas outlets={outlets} rotation={rotation} size={600} />

      <WheelResult
        outlet={result}
        open={!!result}
        onClose={handleCloseResult}
        onSpinAgain={handleSpinAgain}
      />
    </Box>
  );
}
