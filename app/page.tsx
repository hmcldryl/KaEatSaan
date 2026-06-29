"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from "@mui/material/CircularProgress";
import TuneIcon from "@mui/icons-material/Tune";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import RouletteWheel from "@/components/wheel/RouletteWheel";
import { useFoodOutlets } from "@/hooks/useFoodOutlets";
import { useUIStore } from "@/lib/store/uiStore";
import { useHistoryStore } from "@/lib/store/historyStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { FoodOutlet } from "@/types/foodOutlet";
import { HistoryEntry } from "@/types/history";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";
import AuthDialog from "@/components/auth/AuthDialog";

function computeStreak(history: HistoryEntry[]): number {
  if (!history.length) return 0;
  const days = new Set(
    history.map((e) => {
      const d = new Date(e.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let cur = today.getTime();
  if (!days.has(cur)) cur -= 86400000;
  while (days.has(cur)) { streak++; cur -= 86400000; }
  return streak;
}

// Canvas top locked at 31vh. WHEEL_BOTTOM derived so increasing WHEEL_SIZE
// expands the wheel downward + sideways only, never upward.
const WHEEL_SIZE = "min(75vh, 900px)";
const WHEEL_BOTTOM = `calc(56vh - ${WHEEL_SIZE})`; // = -6vh at 75vh; grows more negative as size increases
const WHEEL_RADIUS_SPACE = "54vh";

export default function Home() {
  const { outlets, isLoading } = useFoodOutlets();
  const { setIsSpinning, setFiltersModalOpen } = useUIStore();
  const { history, addEntry: addHistoryEntry } = useHistoryStore();
  const filters = useFiltersStore();
  const activeFiltersCount = filters.getActiveFiltersCount();
  const { user, signOut } = useAuthStore();

  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const level = Math.floor(history.length / 5) + 1;
  const streak = useMemo(() => computeStreak(history), [history]);

  const handleSpinEnd = (outlet: FoodOutlet) => {
    setIsSpinning(false);
    addHistoryEntry(outlet, {
      budget: filters.budget,
      distance: filters.distance,
      classifications: filters.classifications,
      cuisines: filters.cuisines,
      includeClosedOutlets: filters.includeClosedOutlets,
      onlyNewPlaces: filters.onlyNewPlaces,
      maxOutlets: filters.maxOutlets,
    });
  };

  return (
    <Box sx={{ position: "relative", height: "100%", overflow: "hidden" }}>

      {/* FAB column: user badge + filter button, stacked top-right */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        {user ? (
          <>
            <Box
              onClick={(e) => setMenuAnchor(e.currentTarget as HTMLElement)}
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "9999px",
                border: "1.5px solid rgba(0,0,0,0.08)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                px: 1.5,
                py: 0.75,
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                userSelect: "none",
                transition: "transform 0.15s ease",
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "0.68rem", color: "#AB3500", letterSpacing: "0.04em" }}>
                LVL {level}
              </Typography>
              <Box sx={{ width: "1px", height: 12, bgcolor: "rgba(139,90,60,0.25)" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "0.68rem", color: "#6B7280", display: "flex", alignItems: "center", gap: 0.5 }}>
                🔥 {streak}
              </Typography>
              <Avatar
                src={user.photoURL || undefined}
                alt={user.displayName || "User"}
                sx={{ width: 28, height: 28, bgcolor: "#FF6B35", fontSize: "0.72rem", fontWeight: 700, border: "2px solid rgba(255,107,53,0.25)", ml: 0.5 }}
              >
                {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
              </Avatar>
            </Box>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", mt: 1 } }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography variant="body2" color="text.secondary">{user.displayName || user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { setAddModalOpen(true); setMenuAnchor(null); }}>
                <ListItemIcon><AddIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
                Add Kainan
              </MenuItem>
              <MenuItem onClick={async () => { await signOut(); setMenuAnchor(null); }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
                Sign Out
              </MenuItem>
              <MenuItem disabled sx={{ opacity: 0.5, justifyContent: "center" }}>
                <Typography variant="caption" color="text.secondary">v{process.env.NEXT_PUBLIC_APP_VERSION}</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            onClick={() => setAuthDialogOpen(true)}
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "9999px",
              border: "1.5px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              px: 1.5,
              py: 0.75,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              cursor: "pointer",
              userSelect: "none",
              transition: "transform 0.15s ease",
              "&:active": { transform: "scale(0.95)" },
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: "#6B7280" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#6B7280" }}>Sign in</Typography>
          </Box>
        )}

        {/* Filter FAB */}
        <IconButton
          onClick={() => setFiltersModalOpen(true)}
          aria-label="filters"
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#FFFFFF",
            border: "1.5px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            "&:hover": { bgcolor: "#FFF4F0" },
            "&:active": { transform: "scale(0.9)" },
            transition: "all 0.15s ease",
          }}
        >
          <Badge
            badgeContent={activeFiltersCount}
            sx={{ "& .MuiBadge-badge": { bgcolor: "#FF6B35", color: "#fff", fontWeight: 700, fontSize: "0.6rem", minWidth: 14, height: 14, p: 0 } }}
          >
            <TuneIcon sx={{ fontSize: 18, color: "#6B7280" }} />
          </Badge>
        </IconButton>
      </Box>

      {/* Top content: logo + result + loading/empty — fills space above wheel */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: WHEEL_RADIUS_SPACE,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: "20px",
          pt: "60px",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <Image
          src="/logo.png"
          alt="KaEatSaan"
          height={80}
          width={240}
          className="logo-bounce"
          style={{ height: 112, width: "auto", flexShrink: 0 }}
          priority
        />

        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={18} sx={{ color: "#FF6B35" }} />
            <Typography sx={{ color: "#6B7280", fontSize: "0.8rem", fontWeight: 600 }}>Loading...</Typography>
          </Box>
        )}

        {!isLoading && outlets.length === 0 && (
          <Box sx={{ bgcolor: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", borderRadius: "20px", p: 3, textAlign: "center", width: "100%" }}>
            <Typography sx={{ fontWeight: 800, color: "#1F2937", mb: 1, fontSize: "1rem" }}>No Kainan Yet</Typography>
            <Typography sx={{ color: "#6B7280", mb: 2, fontSize: "0.85rem" }}>Add your favorite kainan to get started!</Typography>
            {user ? (
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}
                sx={{ bgcolor: "#FF6B35", borderRadius: "9999px", fontWeight: 700, "&:hover": { bgcolor: "#E55A20" } }}>
                Add Kainan
              </Button>
            ) : (
              <Button variant="outlined" onClick={() => setAuthDialogOpen(true)}
                sx={{ borderColor: "#FF6B35", color: "#FF6B35", borderRadius: "9999px", fontWeight: 700 }}>
                Sign in to add
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Selector text: pinned just above the visible wheel arc, max 3 lines */}
      {currentOutlet && outlets.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: WHEEL_RADIUS_SPACE,
            left: 0,
            right: 0,
            pb: "10px",
            px: "24px",
            zIndex: 21,
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <motion.div
            key={currentOutlet.id}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: "#FF6B35",
                lineHeight: 1.25,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {currentOutlet.name}
            </Typography>
          </motion.div>
        </Box>
      )}

      {/* Wheel: large, positioned so center is at container bottom → only top half visible */}
      {outlets.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: WHEEL_BOTTOM,
            left: "50%",
            transform: "translateX(-50%)",
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            zIndex: 20,
          }}
        >
          <RouletteWheel
            outlets={outlets}
            onSpinStart={() => setIsSpinning(true)}
            onSpinEnd={handleSpinEnd}
            onCurrentChange={setCurrentOutlet}
          />
        </Box>
      )}

      {/* Fade gradient: fades bottom of visible wheel arc into nav bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "140px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,107,53,0.35) 50%, rgba(255,107,53,0.92) 90%)",
          pointerEvents: "none",
          zIndex: 22,
        }}
      />

      <AddFoodOutletModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Box>
  );
}
