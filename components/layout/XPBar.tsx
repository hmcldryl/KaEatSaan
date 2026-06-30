"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { UserProfile } from "@/types/userProfile";
import { xpToLevel } from "@/lib/store/userProfileStore";

export default function XPBar({ profile }: { profile: UserProfile }) {
  const xp = profile.xp ?? 0;
  const level = xpToLevel(xp);
  const xpInLevel = xp % 100;

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "9999px",
        border: "1.5px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        px: 1.5,
        py: 0.75,
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 130,
      }}
    >
      <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, color: "#FF6B35", whiteSpace: "nowrap" }}>
        Lv.{level}
      </Typography>
      <Box sx={{ flex: 1, height: 5, bgcolor: "#F3F4F6", borderRadius: "9999px", overflow: "hidden" }}>
        <Box
          sx={{
            height: "100%",
            width: `${xpInLevel}%`,
            background: "linear-gradient(90deg, #FF6B35 0%, #FFB347 100%)",
            borderRadius: "9999px",
            transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.6rem", color: "#9CA3AF", whiteSpace: "nowrap" }}>
        {xpInLevel}/100
      </Typography>
    </Box>
  );
}
