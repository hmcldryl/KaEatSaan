"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import CasinoIcon from "@mui/icons-material/Casino";
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
  while (days.has(cur)) {
    streak++;
    cur -= 86400000;
  }
  return streak;
}

export default function Home() {
  const { outlets, isLoading } = useFoodOutlets();
  const { setIsSpinning, setFiltersModalOpen } = useUIStore();
  const { history, addEntry: addHistoryEntry } = useHistoryStore();
  const filters = useFiltersStore();
  const activeFiltersCount = filters.getActiveFiltersCount();
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const spinCount = history.length;
  const level = Math.floor(spinCount / 5) + 1;
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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        py: "20px",
        overflow: "hidden",
      }}
    >
      {/* TOP: Profile chip */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", px: "20px" }}>
        {user ? (
          <>
            <Box
              onClick={(e) => setMenuAnchor(e.currentTarget as HTMLElement)}
              sx={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
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
              <Typography
                sx={{ fontWeight: 800, fontSize: "0.7rem", color: "#AB3500", letterSpacing: "0.04em" }}
              >
                LVL {level}
              </Typography>
              <Box sx={{ width: "1px", height: 12, bgcolor: "rgba(139,90,60,0.3)" }} />
              <Typography
                sx={{ fontWeight: 700, fontSize: "0.7rem", color: "#6B7280", display: "flex", alignItems: "center", gap: 0.5 }}
              >
                🔥 {streak}
              </Typography>
              <Avatar
                src={user.photoURL || undefined}
                alt={user.displayName || "User"}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#FF6B35",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  border: "2px solid rgba(255,107,53,0.3)",
                  ml: 0.5,
                }}
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
                <Typography variant="body2" color="text.secondary">
                  {user.displayName || user.email}
                </Typography>
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
                <Typography variant="caption" color="text.secondary">
                  v{process.env.NEXT_PUBLIC_APP_VERSION}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box
            onClick={() => setAuthDialogOpen(true)}
            sx={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
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
            <PersonIcon sx={{ fontSize: 18, color: "#6B7280" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#6B7280" }}>
              Sign in
            </Typography>
          </Box>
        )}
      </Box>

      {/* CENTER: Logo + Wheel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100%",
          overflow: "hidden",
          px: "20px",
        }}
      >
        {/* Floating logo — CSS filter inverts orange to white on the orange bg */}
        <Image
          src="/logo.png"
          alt="KaEatSaan"
          height={72}
          width={190}
          className="logo-bounce"
          style={{
            height: 72,
            width: "auto",
            filter: "brightness(0) invert(1) drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
            flexShrink: 0,
          }}
          priority
        />

        {/* Result pill */}
        {currentOutlet && (
          <Box
            sx={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              borderRadius: "9999px",
              px: 2.5,
              py: 0.75,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              maxWidth: "90%",
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "#AB3500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentOutlet.name}
            </Typography>
          </Box>
        )}

        {/* Loading */}
        {isLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} sx={{ color: "rgba(255,255,255,0.8)" }} />
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 600 }}>
              Loading...
            </Typography>
          </Box>
        )}

        {/* Wheel */}
        {outlets.length > 0 && (
          <Box
            sx={{
              width: { xs: "280px", sm: "340px" },
              height: { xs: "280px", sm: "340px" },
              flexShrink: 0,
            }}
          >
            <RouletteWheel
              outlets={outlets}
              onSpinStart={() => setIsSpinning(true)}
              onSpinEnd={handleSpinEnd}
              onCurrentChange={setCurrentOutlet}
              triggerSpin={spinTrigger > 0 ? spinTrigger : undefined}
            />
          </Box>
        )}

        {/* Empty state */}
        {!isLoading && outlets.length === 0 && (
          <Box
            className="glass-card"
            sx={{ borderRadius: "20px", p: 3, textAlign: "center", width: "100%" }}
          >
            <Typography sx={{ fontWeight: 800, color: "#1F2937", mb: 1, fontSize: "1.1rem" }}>
              No Kainan Yet
            </Typography>
            <Typography sx={{ color: "#6B7280", mb: 2, fontSize: "0.9rem" }}>
              Add your favorite kainan to get started!
            </Typography>
            {user ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: "#FF6B35",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#E55A20" },
                }}
              >
                Add Kainan
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setAuthDialogOpen(true)}
                sx={{
                  borderColor: "#FF6B35",
                  color: "#FF6B35",
                  borderRadius: "9999px",
                  fontWeight: 700,
                }}
              >
                Sign in to add
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* BOTTOM: Action row */}
      <Box sx={{ width: "100%", px: "20px", pb: "96px", flexShrink: 0 }}>
        {outlets.length > 0 && (
          <Box
            className="glass-card"
            sx={{
              borderRadius: "9999px",
              p: "6px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            }}
          >
            <IconButton
              onClick={() => setFiltersModalOpen(true)}
              aria-label="filters"
              sx={{
                width: 56,
                height: 56,
                borderRadius: "9999px",
                color: "#6B7280",
                flexShrink: 0,
                "&:hover": { color: "#FF6B35", bgcolor: "rgba(255,107,53,0.08)" },
                "&:active": { transform: "scale(0.88)" },
                transition: "all 0.15s ease",
              }}
            >
              <Badge
                badgeContent={activeFiltersCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#FF6B35",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <TuneIcon />
              </Badge>
            </IconButton>

            <Button
              onClick={() => setSpinTrigger((p) => p + 1)}
              variant="contained"
              endIcon={<CasinoIcon />}
              sx={{
                flex: 1,
                height: 56,
                borderRadius: "9999px",
                bgcolor: "#FF6B35",
                fontWeight: 800,
                fontSize: "1.05rem",
                letterSpacing: "0.08em",
                boxShadow: "0 12px 32px rgba(255,107,53,0.4)",
                "&:hover": { bgcolor: "#E55A20" },
                "&:active": { transform: "scale(0.96)" },
                transition: "all 0.15s ease",
              }}
            >
              SAAN?
            </Button>

            <IconButton
              onClick={() => router.push("/favorites")}
              aria-label="favorites"
              sx={{
                width: 56,
                height: 56,
                borderRadius: "9999px",
                color: "#6B7280",
                flexShrink: 0,
                "&:hover": { color: "#FF6B35", bgcolor: "rgba(255,107,53,0.08)" },
                "&:active": { transform: "scale(0.88)" },
                transition: "all 0.15s ease",
              }}
            >
              <FavoriteIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <AddFoodOutletModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Box>
  );
}
