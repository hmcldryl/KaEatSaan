"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { useXPNotifStore, XPNotif } from "@/lib/store/xpNotifStore";

function getTarget(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const el = document.querySelector("[data-xp-badge]");
  if (el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return { x: window.innerWidth - 60, y: 50 };
}

function XPNotifItem({ notif, onDone }: { notif: XPNotif; onDone: () => void }) {
  const target = getTarget();
  const sx = notif.x;
  const sy = notif.y;
  const ex = target.x;
  const ey = target.y;

  return (
    <motion.div
      style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none", zIndex: 9999 }}
      animate={{
        x: [sx, sx, ex],
        y: [sy, sy - 18, ey],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.1, 1, 0.6],
      }}
      transition={{ duration: 1.6, times: [0, 0.08, 0.78, 1], ease: "easeInOut" }}
      onAnimationComplete={onDone}
    >
      <div style={{ transform: "translate(-50%, -50%)" }}>
        <Box
          sx={{
            bgcolor: "#FF6B35",
            color: "#fff",
            borderRadius: "9999px",
            px: 1,
            py: 0.2,
            fontSize: "0.65rem",
            fontWeight: 800,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 10px rgba(255,107,53,0.55)",
            letterSpacing: "0.03em",
          }}
        >
          +{notif.amount} XP
        </Box>
      </div>
    </motion.div>
  );
}

export default function XPFloatingNotifications() {
  const { notifs, remove } = useXPNotifStore();
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) return null;

  return createPortal(
    <>
      {notifs.map((notif) => (
        <XPNotifItem key={notif.id} notif={notif} onDone={() => remove(notif.id)} />
      ))}
    </>,
    document.body,
  );
}
