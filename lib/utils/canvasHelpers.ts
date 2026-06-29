export function getScaledCanvas(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const targetW = Math.round(rect.width * dpr);
  const targetH = Math.round(rect.height * dpr);

  if (canvas.width !== targetW || canvas.height !== targetH) {
    // Only resize when dimensions change — avoids GPU texture flush every frame
    canvas.width = targetW;
    canvas.height = targetH;
    // width/height assignment auto-resets transform
  } else {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset accumulated scale without texture flush
  }

  ctx.scale(dpr, dpr);
  return ctx;
}

// Cache word-wrap results — inputs are stable during spin so cache hits every frame
const textWrapCache = new Map<string, string[]>();

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
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fillStyle = color;
  ctx.fill();

  // Draw border between segments
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Text curves along the arc near the outer edge.
  // rotate(midAngle) + translate(textR,0) + rotate(PI/2) → tangential direction.
  // Segments at 12-o-clock read normally; bottom segments are inverted so they
  // read correctly when the wheel rotates them to the top.
  if (text) {
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    // 40px inward gives multi-line text clearance from the outer edge and pointer
    const textR = radius - 40;
    const arcSpan = (endAngle - startAngle) * textR;
    const maxW = arcSpan * 0.85;
    const lineHeight = 13;
    const maxLines = 4;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);
    ctx.translate(textR, 0);
    ctx.rotate(Math.PI / 2);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const isDarkBg = color === "#FF6B35";
    ctx.fillStyle = isDarkBg ? "#FFFFFF" : color === "#D1D5DB" ? "#6B7280" : "#AB3500";
    ctx.shadowColor = isDarkBg ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.font = "bold 11px Montserrat, sans-serif";

    const cacheKey = `${text}|${maxW.toFixed(2)}`;
    let finalLines = textWrapCache.get(cacheKey);
    if (!finalLines) {
      // Word-wrap into lines
      const words = text.split(" ");
      const rawLines: string[] = [];
      let current = "";
      for (const word of words) {
        const test = current ? current + " " + word : word;
        if (ctx.measureText(test).width <= maxW) {
          current = test;
        } else {
          if (current) rawLines.push(current);
          current = word;
        }
      }
      if (current) rawLines.push(current);

      // Clip to maxLines; truncate last visible line if text was cut
      const clipped = rawLines.slice(0, maxLines);
      if (rawLines.length > maxLines) {
        let last = clipped[maxLines - 1];
        while (ctx.measureText(last + "…").width > maxW && last.length > 1) {
          last = last.substring(0, last.length - 1);
        }
        clipped[maxLines - 1] = last + "…";
      }
      finalLines = clipped.map((line) => {
        let l = line;
        while (ctx.measureText(l).width > maxW && l.length > 4) {
          l = l.substring(0, l.length - 2) + "…";
        }
        return l;
      });
      if (textWrapCache.size > 500) textWrapCache.clear();
      textWrapCache.set(cacheKey, finalLines);
    }

    const totalH = (finalLines.length - 1) * lineHeight;
    for (let i = 0; i < finalLines.length; i++) {
      ctx.fillText(finalLines[i], 0, -totalH / 2 + i * lineHeight);
    }

    ctx.restore();
  }
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
  const pointerPosition = -size - 25; // Move up into the outer ring

  ctx.beginPath();
  ctx.moveTo(0, pointerPosition + pointerHeight); // Point (pointing down)
  ctx.lineTo(-pointerSize, pointerPosition); // Left
  ctx.lineTo(pointerSize, pointerPosition); // Right
  ctx.closePath();

  // Fill with orange color
  ctx.fillStyle = "#FF6B35";
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
  buttonRadius: number,
  logoImg?: HTMLImageElement,
): void {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FF6B35";
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.stroke();

  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, buttonRadius - 6, 0, Math.PI * 2);
    ctx.clip();
    ctx.filter = "brightness(0) invert(1)";
    ctx.globalAlpha = 0.92;
    const scale = Math.min(
      (buttonRadius * 1.55) / logoImg.naturalWidth,
      (buttonRadius * 0.9) / logoImg.naturalHeight,
    );
    const w = logoImg.naturalWidth * scale;
    const h = logoImg.naturalHeight * scale;
    ctx.drawImage(logoImg, centerX - w / 2, centerY - h / 2, w, h);
    ctx.restore();
  } else {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍴", centerX, centerY);
  }

  ctx.restore();
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
  // 3-color palette ensures no two adjacent segments share a color on a circular wheel,
  // including the wrap-around (first ↔ last). Fix: when count%3===1 the last and first
  // would both be palette[0]; replace last with palette[1].
  const palette = ["#FF6B35", "#FFFFFF", "#FFD4C4"];
  const colors = Array.from({ length: count }, (_, i) => palette[i % 3]);
  if (count > 1 && count % 3 === 1) colors[count - 1] = palette[1];
  return colors;
}
