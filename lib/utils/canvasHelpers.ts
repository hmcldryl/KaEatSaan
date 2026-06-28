export function getScaledCanvas(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
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
  text: string,
): void {
  // Draw segment with subtle shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();

  // Draw border between segments
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw text
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle + (endAngle - startAngle) / 2);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  // White text on orange segments, dark orange on white segments
  const isOrange = color === "#FF6B35";
  ctx.fillStyle = isOrange ? "#FFFFFF" : "#AB3500";

  ctx.font = "bold 12px Montserrat, sans-serif";

  // Shadow for readability
  ctx.shadowColor = isOrange ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.8)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Truncate text if too long
  const maxLength = 12;
  const displayText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  ctx.fillText(displayText, radius - 35, 0);
  ctx.restore();
}

export function drawPointer(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
): void {
  ctx.save();
  ctx.translate(centerX, centerY);

  // Add shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
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

  // Fill with orange color
  ctx.fillStyle = "#E37725";
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  // Add white border for contrast
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

export function drawCenterCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  const buttonRadius = radius * 0.5; // Smaller center circle

  // Add shadow/glow effect
  ctx.shadowColor = "rgba(255, 107, 53, 0.4)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // Draw outer circle with gradient (orange theme)
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY - 10,
    0,
    centerX,
    centerY,
    buttonRadius,
  );
  gradient.addColorStop(0, "#F59842");
  gradient.addColorStop(0.5, "#E37725");
  gradient.addColorStop(1, "#C4621B");
  ctx.fillStyle = gradient;
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // White border
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.stroke();

  // Add highlight on top for glossy effect
  ctx.beginPath();
  ctx.arc(
    centerX,
    centerY - buttonRadius / 3,
    buttonRadius / 3,
    0,
    Math.PI * 2,
  );
  const highlightGradient = ctx.createRadialGradient(
    centerX,
    centerY - buttonRadius / 3,
    0,
    centerX,
    centerY - buttonRadius / 3,
    buttonRadius / 3,
  );
  highlightGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  highlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = highlightGradient;
  ctx.fill();
}

export function drawOuterRing(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  const outerRadius = radius + 30;
  const ringThickness = 25;
  const innerRingRadius = outerRadius - ringThickness;

  // Draw shadow for the outer ring
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;

  // White outer ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.arc(centerX, centerY, innerRingRadius, 0, Math.PI * 2, true);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.restore();

  // Inner border of ring
  ctx.strokeStyle = "rgba(255, 107, 53, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRingRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Outer border of ring
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Decorative dots — alternating orange and white
  const dotCount = 16;
  const dotRadius = 5;
  const dotRingRadius = innerRingRadius + ringThickness / 2;

  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const dotX = centerX + dotRingRadius * Math.cos(angle);
    const dotY = centerY + dotRingRadius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? "#FF6B35" : "#FFD4C4";
    ctx.fill();
  }
}

export function getSegmentColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(i % 2 === 0 ? "#FF6B35" : "#FFFFFF");
  }
  return colors;
}
