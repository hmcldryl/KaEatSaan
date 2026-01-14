export function getScaledCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Get device pixel ratio for sharp rendering on retina displays
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set canvas size accounting for device pixel ratio
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale context to match device pixel ratio
  ctx.scale(dpr, dpr);

  return ctx;
}

export function drawSegment(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  color: string,
  text: string
): void {
  // Draw segment
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fillStyle = color;
  ctx.fill();

  // Draw border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw text
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle + (endAngle - startAngle) / 2);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Roboto, sans-serif';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Truncate text if too long
  const maxLength = 15;
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  ctx.fillText(displayText, radius - 20, 0);
  ctx.restore();
}

export function drawPointer(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number
): void {
  ctx.save();
  ctx.translate(centerX, centerY);

  // Draw triangle pointer at top
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(-size / 2, -size - 20);
  ctx.lineTo(size / 2, -size - 20);
  ctx.closePath();

  // Fill with gradient
  const gradient = ctx.createLinearGradient(0, -size - 20, 0, -size);
  gradient.addColorStop(0, '#FF6B35');
  gradient.addColorStop(1, '#E64A1A');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Add border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

export function drawCenterCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): void {
  // Add shadow/glow effect
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Draw outer circle with gradient
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, '#FF7B45');
  gradient.addColorStop(1, '#FF6B35');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw inner decorative circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw play icon (triangle)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(centerX - 8, centerY - 12);
  ctx.lineTo(centerX - 8, centerY + 12);
  ctx.lineTo(centerX + 12, centerY);
  ctx.closePath();
  ctx.fill();

  // Draw "TAP" text below icon
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 10px Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAP', centerX, centerY + 22);
}

export function getSegmentColors(count: number): string[] {
  // Alternating vibrant colors for good contrast
  const baseColors = [
    '#FF6B35', // Orange
    '#4ECDC4', // Teal
    '#F7B731', // Yellow
    '#5F27CD', // Purple
    '#00D2D3', // Cyan
    '#FF6348', // Red
    '#1DD1A1', // Green
    '#FF9FF3', // Pink
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}
