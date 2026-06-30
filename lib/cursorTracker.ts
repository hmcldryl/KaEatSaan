let _last = { x: 0, y: 0 };

export function initCursorTracker() {
  if (typeof window === "undefined") return () => {};
  _last = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const onMove = (e: MouseEvent) => { _last = { x: e.clientX, y: e.clientY }; };
  const onTouch = (e: TouchEvent) => {
    if (e.touches[0]) _last = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchstart", onTouch, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchstart", onTouch);
  };
}

export function getLastCursor() {
  return { ..._last };
}
