import { Restaurant } from '@/types/restaurant';

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function calculateWinner(
  rotation: number,
  restaurants: Restaurant[]
): Restaurant {
  const segmentCount = restaurants.length;
  const degreesPerSegment = 360 / segmentCount;

  // Normalize rotation to 0-360 range
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  // Pointer is at the top (90 degrees), so we need to adjust
  // We calculate from the top and go clockwise
  const adjustedRotation = (450 - normalizedRotation) % 360;

  // Calculate which segment the pointer is pointing at
  const segmentIndex = Math.floor(adjustedRotation / degreesPerSegment);

  return restaurants[segmentIndex];
}

export function generateFinalRotation(
  targetIndex: number,
  segmentCount: number
): number {
  const degreesPerSegment = 360 / segmentCount;

  // Calculate angle for target segment (from top, going clockwise)
  const targetAngle = targetIndex * degreesPerSegment;

  // Add randomness within the segment
  const randomOffset = Math.random() * degreesPerSegment * 0.8 + degreesPerSegment * 0.1;

  // Add multiple full rotations (3-5 spins)
  const fullRotations = (3 + Math.random() * 2) * 360;

  // Calculate final rotation
  // We need to invert because wheel spins clockwise but pointer is fixed
  const finalRotation = fullRotations + (360 - targetAngle - randomOffset);

  return finalRotation;
}

export function animateWheel(
  startTime: number,
  duration: number,
  startRotation: number,
  endRotation: number,
  onUpdate: (rotation: number) => void,
  onComplete: () => void
): number {
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing function
    const easedProgress = easeOutCubic(progress);

    // Calculate current rotation
    const currentRotation = startRotation + (endRotation - startRotation) * easedProgress;

    onUpdate(currentRotation);

    if (progress < 1) {
      return requestAnimationFrame(animate);
    } else {
      onComplete();
      return 0;
    }
  };

  return requestAnimationFrame(animate);
}
