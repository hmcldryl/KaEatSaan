export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function animateWheel(
  startTime: number,
  duration: number,
  startRotation: number,
  endRotation: number,
  onUpdate: (rotation: number) => void,
  onComplete: (finalRotation: number) => void
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
      onComplete(endRotation);
      return 0;
    }
  };

  return requestAnimationFrame(animate);
}
