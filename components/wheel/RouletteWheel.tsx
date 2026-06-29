"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import WheelCanvas from "./WheelCanvas";
import WheelResult from "./WheelResult";
import { FoodOutlet } from "@/types/foodOutlet";
import { animateWheel } from "@/lib/utils/wheelAnimation";

export const SPIN_AGAIN_PREFIX = "__spin_again__";
const MIN_SEGMENTS = 4;

function makeSpinAgainOutlet(index: number): FoodOutlet {
  return {
    id: `${SPIN_AGAIN_PREFIX}${index}`,
    name: "Spin Again",
    classification: "Other",
    cuisine: "Other",
    budget: 1,
    location: { latitude: 0, longitude: 0, address: "" },
    createdAt: "",
  };
}

interface RouletteWheelProps {
  outlets: FoodOutlet[];
  onSpinStart?: () => void;
  onSpinEnd?: (outlet: FoodOutlet) => void;
  onCurrentChange?: (outlet: FoodOutlet | null) => void;
  triggerSpin?: number;
}

function getSegmentAtPointer(rotation: number, outlets: FoodOutlet[]): FoodOutlet | null {
  if (outlets.length === 0) return null;
  const segmentAngle = 360 / outlets.length;
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const segmentIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % outlets.length;
  return outlets[segmentIndex] || null;
}

export default function RouletteWheel({
  outlets,
  onSpinStart,
  onSpinEnd,
  onCurrentChange,
  triggerSpin = 0,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<FoodOutlet | null>(null);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());

  const lastTriggerRef = useRef(0);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const spinRef = useRef<(() => void) | null>(null);
  const lastOutletIdRef = useRef<string | null>("__init__");

  // Real outlets after exclusions
  const activeOutlets = useMemo(
    () => outlets.filter((o) => !excludedIds.has(o.id)),
    [outlets, excludedIds],
  );

  // Pad to minimum 4 segments with "Spin Again" placeholders
  const paddedOutlets = useMemo(() => {
    if (activeOutlets.length >= MIN_SEGMENTS) return activeOutlets;
    const needed = MIN_SEGMENTS - activeOutlets.length;
    return [
      ...activeOutlets,
      ...Array.from({ length: needed }, (_, i) => makeSpinAgainOutlet(i)),
    ];
  }, [activeOutlets]);

  // Ref always points to latest padded outlets for use in animation callbacks
  const activeOutletsRef = useRef<FoodOutlet[]>([]);
  useEffect(() => { activeOutletsRef.current = paddedOutlets; }, [paddedOutlets]);

  // Drag/swipe state
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragLastAngle = useRef(0);
  const dragLastTime = useRef(0);
  const angularVelocity = useRef(0);

  useEffect(() => {
    const current = getSegmentAtPointer(rotation, paddedOutlets);
    const newId = (!current || current.id.startsWith(SPIN_AGAIN_PREFIX)) ? null : current.id;
    // Only propagate when segment actually changes — avoids 60 re-renders/sec for same segment
    if (newId === lastOutletIdRef.current) return;
    lastOutletIdRef.current = newId;
    if (onCurrentChange) {
      onCurrentChange(newId !== null ? current! : null);
    }
  }, [rotation, paddedOutlets, onCurrentChange]);

  // spin() uses refs instead of closed-over state so it stays stable and
  // can be safely called from animation callbacks and auto-spin timeouts.
  const spin = useCallback(() => {
    const active = activeOutletsRef.current;
    if (isSpinningRef.current || active.length === 0) return;

    isSpinningRef.current = true;
    setIsSpinning(true);
    onSpinStart?.();

    const totalRotation = (3 + Math.random() * 2) * 360 + Math.random() * 360;
    const startTime = performance.now();
    const startRotation = rotationRef.current % 360;

    animateWheel(
      startTime,
      3500,
      startRotation,
      startRotation + totalRotation,
      (r) => { rotationRef.current = r; setRotation(r); },
      (finalRotation) => {
        const winner = getSegmentAtPointer(finalRotation, activeOutletsRef.current);
        isSpinningRef.current = false;
        setIsSpinning(false);

        if (winner?.id.startsWith(SPIN_AGAIN_PREFIX)) {
          // Land on "Spin Again" → auto-spin after short pause
          setTimeout(() => spinRef.current?.(), 500);
        } else if (winner) {
          setResult(winner);
          onSpinEnd?.(winner);
        }
      },
    );
  }, [onSpinStart, onSpinEnd]);

  // Keep spinRef pointing to latest spin callback
  useEffect(() => { spinRef.current = spin; }, [spin]);

  useEffect(() => {
    if (triggerSpin !== lastTriggerRef.current) {
      lastTriggerRef.current = triggerSpin;
      if (triggerSpin && !isSpinning) {
        const id = setTimeout(spin, 0);
        return () => clearTimeout(id);
      }
    }
  }, [triggerSpin, isSpinning, spin]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isSpinning || activeOutletsRef.current.length === 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragLastAngle.current = Math.atan2(dy, dx);
    dragLastTime.current = performance.now();
    isDragging.current = true;
    hasMoved.current = false;
    angularVelocity.current = 0;
  }, [isSpinning]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || isSpinning) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    const currentAngle = Math.atan2(dy, dx);
    const now = performance.now();

    let delta = currentAngle - dragLastAngle.current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    const dt = now - dragLastTime.current;
    if (dt > 0) angularVelocity.current = delta / dt;

    if (dragStartPos.current) {
      const mdx = e.clientX - dragStartPos.current.x;
      const mdy = e.clientY - dragStartPos.current.y;
      if (mdx * mdx + mdy * mdy > 64) hasMoved.current = true;
    }

    rotationRef.current += (delta * 180) / Math.PI;
    setRotation(rotationRef.current);

    dragLastAngle.current = currentAngle;
    dragLastTime.current = now;
  }, [isSpinning]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (!hasMoved.current) {
      spin();
      return;
    }

    const speedDegPerMs = Math.abs(angularVelocity.current * 180 / Math.PI);
    if (speedDegPerMs > 0.1) spin();
  }, [spin]);

  const handleSpinAgain = useCallback((removeOutlet?: boolean) => {
    if (removeOutlet && result) {
      setExcludedIds((prev) => new Set([...prev, result.id]));
    }
    setResult(null);
    setTimeout(spin, 300);
  }, [result, spin]);

  const disabled = activeOutlets.length === 0 || !!result;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        touchAction: "none",
        userSelect: "none",
        cursor: isSpinning ? "default" : disabled ? "default" : "grab",
        "&:active": { cursor: isSpinning ? "default" : "grabbing" },
      }}
      onPointerDown={disabled ? undefined : handlePointerDown}
      onPointerMove={disabled ? undefined : handlePointerMove}
      onPointerUp={disabled ? undefined : handlePointerUp}
      onPointerCancel={disabled ? undefined : handlePointerUp}
    >
      <WheelCanvas outlets={paddedOutlets} rotation={rotation} size={800} />
      <WheelResult
        outlet={result}
        open={!!result}
        onClose={() => setResult(null)}
        onSpinAgain={handleSpinAgain}
      />
    </Box>
  );
}
