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
  // Draw segment with subtle shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();

  // Draw border - lighter for the pastel theme
  ctx.strokeStyle = '#F5F5F5';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw text
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle + (endAngle - startAngle) / 2);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  // Use dark text for both light colors
  ctx.fillStyle = '#1F2937';

  ctx.font = '13px Montserrat, sans-serif';

  // Light shadow for better readability
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Truncate text if too long
  const maxLength = 14;
  const displayText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  ctx.fillText(displayText, radius - 25, 0);
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

  // Add shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Draw triangle pointer - positioned at the edge where wheel meets outer ring
  const pointerSize = 20;
  const pointerHeight = 28;
  const pointerPosition = -size - 8; // Position at the wheel edge

  ctx.beginPath();
  ctx.moveTo(0, pointerPosition + pointerHeight); // Point (pointing down)
  ctx.lineTo(-pointerSize, pointerPosition); // Left
  ctx.lineTo(pointerSize, pointerPosition); // Right
  ctx.closePath();

  // Fill with lighter coral color
  ctx.fillStyle = '#FF9B9B';
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Add white border for contrast
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
  const buttonRadius = radius * 0.85; // Smaller button

  // Add shadow/glow effect
  ctx.shadowColor = 'rgba(255, 155, 155, 0.4)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;

  // Draw outer circle with gradient (lighter coral/pink)
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(centerX, centerY - 15, 0, centerX, centerY, buttonRadius);
  gradient.addColorStop(0, '#FFB8B8');
  gradient.addColorStop(0.5, '#FF9B9B');
  gradient.addColorStop(1, '#FF8080');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // White border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Draw inner decorative circle for 3D effect
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius - 15, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Add highlight on top for glossy effect
  ctx.beginPath();
  ctx.arc(centerX, centerY - buttonRadius / 3, buttonRadius / 2.5, 0, Math.PI * 2);
  const highlightGradient = ctx.createRadialGradient(centerX, centerY - buttonRadius / 3, 0, centerX, centerY - buttonRadius / 3, buttonRadius / 2.5);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = highlightGradient;
  ctx.fill();

  // Draw "Saan?" text with dark color for lighter button
  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 18px Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0.5px';

  // Add subtle text shadow for better visibility
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;

  ctx.fillText('Saan?', centerX, centerY);
}

export function drawOuterRing(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): void {
  const outerRadius = radius + 30;
  const ringThickness = 25;
  const innerRingRadius = outerRadius - ringThickness;

  // Draw shadow for the outer ring
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;

  // Draw outer ring with gradient (lighter yellow/gold)
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerRingRadius, 0, Math.PI * 2, true);

  const gradient = ctx.createLinearGradient(centerX - outerRadius, centerY, centerX + outerRadius, centerY);
  gradient.addColorStop(0, '#FFE4A3');
  gradient.addColorStop(0.5, '#FFD966');
  gradient.addColorStop(1, '#FFE4A3');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();

  // Add inner shadow to ring
  ctx.strokeStyle = '#FFCC33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Add outer shadow to ring
  ctx.strokeStyle = '#FFF5D6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw decorative dots on the ring
  const dotCount = 16;
  const dotRadius = 6;
  const dotRingRadius = innerRingRadius + ringThickness / 2;

  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const dotX = centerX + dotRingRadius * Math.cos(angle);
    const dotY = centerY + dotRingRadius * Math.sin(angle);

    // Draw dot shadow
    ctx.beginPath();
    ctx.arc(dotX, dotY + 1, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fill();

    // Draw white dot
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Add highlight to dot
    ctx.beginPath();
    ctx.arc(dotX - 1.5, dotY - 1.5, dotRadius / 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }
}

export function getSegmentColors(count: number): string[] {
  // Light coral/salmon and white stripes
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(i % 2 === 0 ? '#FF9B9B' : '#FFFFFF');
  }
  return colors;
}
