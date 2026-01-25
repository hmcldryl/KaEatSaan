"use client";

import React, { useEffect, useRef } from "react";
import { FoodOutlet } from "@/types/foodOutlet";
import {
  getScaledCanvas,
  drawSegment,
  drawPointer,
  drawCenterCircle,
  drawOuterRing,
  getSegmentColors,
} from "@/lib/utils/canvasHelpers";

interface WheelCanvasProps {
  outlets: FoodOutlet[];
  rotation: number;
  size?: number;
}

export default function WheelCanvas({
  outlets,
  rotation,
  size = 300,
}: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = getScaledCanvas(canvas);
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 70; // Account for outer ring

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Save context state
    ctx.save();

    // Translate to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw wheel segments
    const isEmpty = outlets.length === 0;
    const segmentCount = isEmpty ? 8 : outlets.length; // Show 8 empty segments when no data
    const segmentAngle = (Math.PI * 2) / segmentCount;
    const colors = getSegmentColors(segmentCount);

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * segmentAngle - Math.PI / 2; // Start from top
      const endAngle = startAngle + segmentAngle;

      // Use muted colors for empty state
      const segmentColor = isEmpty
        ? i % 2 === 0
          ? "#F3F4F6"
          : "#E5E7EB"
        : colors[i];
      const segmentLabel = isEmpty ? "" : outlets[i].name;

      drawSegment(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle,
        segmentColor,
        segmentLabel,
      );
    }

    // Restore context state
    ctx.restore();

    // Draw outer decorative ring (doesn't rotate)
    drawOuterRing(ctx, centerX, centerY, radius);

    // Draw pointer (doesn't rotate) - positioned at the top
    drawPointer(ctx, centerX, centerY, radius);

    // Draw center circle (doesn't rotate)
    drawCenterCircle(ctx, centerX, centerY, 50);
  }, [outlets, rotation, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        display: "block",
        margin: "0 auto",
        objectFit: "contain",
      }}
    />
  );
}
