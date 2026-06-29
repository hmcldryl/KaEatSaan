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
import { SPIN_AGAIN_PREFIX } from "./RouletteWheel";

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
  const rotatingRef = useRef<HTMLCanvasElement>(null);
  const staticRef = useRef<HTMLCanvasElement>(null);

  // Static layer: ring, pointer, center circle — never rotates
  useEffect(() => {
    const canvas = staticRef.current;
    if (!canvas) return;

    function drawStatic(logoImg?: HTMLImageElement) {
      const ctx = getScaledCanvas(canvas!);
      if (!ctx) return;
      const rect = canvas!.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(centerX, centerY) - 76;
      ctx.clearRect(0, 0, rect.width, rect.height);
      drawOuterRing(ctx, centerX, centerY, radius);
      drawPointer(ctx, centerX, centerY, radius);
      drawCenterCircle(ctx, centerX, centerY, 40, logoImg);
    }

    drawStatic(); // draw immediately, logo placeholder shows

    const img = new Image();
    img.src = "/logo.png";
    img.onload = () => drawStatic(img);

    return () => { img.onload = null; };
  }, [outlets.length, size]);

  // Rotating layer: segments + depth gradient — redrawn every animation frame
  useEffect(() => {
    const canvas = rotatingRef.current;
    if (!canvas) return;
    const ctx = getScaledCanvas(canvas);
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 70;

    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    const isEmpty = outlets.length === 0;
    const segmentCount = isEmpty ? 8 : outlets.length;
    const segmentAngle = (Math.PI * 2) / segmentCount;
    const colors = getSegmentColors(segmentCount);

    for (let i = 0; i < segmentCount; i++) {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;
      const isSpinAgainSeg = !isEmpty && outlets[i]?.id.startsWith(SPIN_AGAIN_PREFIX);
      const segmentColor = isEmpty
        ? i % 2 === 0 ? "#F3F4F6" : "#E5E7EB"
        : isSpinAgainSeg ? "#D1D5DB"
        : colors[i];
      const segmentLabel = isEmpty ? "" : outlets[i].name;
      drawSegment(ctx, centerX, centerY, radius, startAngle, endAngle, segmentColor, segmentLabel);
    }

    ctx.restore();

    // // Depth overlay: single radial gradient from bright center to dark rim
    // const depthGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    // depthGrad.addColorStop(0, "rgba(255,255,255,0.13)");
    // depthGrad.addColorStop(0.42, "rgba(0,0,0,0)");
    // depthGrad.addColorStop(1, "rgba(0,0,0,0.2)");
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    // ctx.fillStyle = depthGrad;
    // ctx.fill();
  }, [outlets, rotation, size]);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    maxWidth: `${size}px`,
    maxHeight: `${size}px`,
    display: "block",
    margin: "0 auto",
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={rotatingRef} width={size} height={size} style={canvasStyle} />
      <canvas ref={staticRef} width={size} height={size} style={{ ...canvasStyle, pointerEvents: "none" }} />
    </div>
  );
}
