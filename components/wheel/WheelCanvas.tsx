'use client';

import React, { useEffect, useRef } from 'react';
import { Restaurant } from '@/types/restaurant';
import {
  getScaledCanvas,
  drawSegment,
  drawPointer,
  drawCenterCircle,
  getSegmentColors,
} from '@/lib/utils/canvasHelpers';

interface WheelCanvasProps {
  restaurants: Restaurant[];
  rotation: number;
  size?: number;
}

export default function WheelCanvas({ restaurants, rotation, size = 300 }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || restaurants.length === 0) return;

    const ctx = getScaledCanvas(canvas);
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Save context state
    ctx.save();

    // Translate to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw wheel segments
    const segmentCount = restaurants.length;
    const segmentAngle = (Math.PI * 2) / segmentCount;
    const colors = getSegmentColors(segmentCount);

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * segmentAngle - Math.PI / 2; // Start from top
      const endAngle = startAngle + segmentAngle;

      drawSegment(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle,
        colors[i],
        restaurants[i].name
      );
    }

    // Restore context state
    ctx.restore();

    // Draw center circle (doesn't rotate)
    drawCenterCircle(ctx, centerX, centerY, 50);

    // Draw pointer (doesn't rotate)
    drawPointer(ctx, centerX, centerY, radius);
  }, [restaurants, rotation, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: `${size}px`,
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
}
