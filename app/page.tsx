"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import TuneIcon from "@mui/icons-material/Tune";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RouletteWheel from "@/components/wheel/RouletteWheel";
import { useFoodOutlets } from "@/hooks/useFoodOutlets";
import { useUIStore } from "@/lib/store/uiStore";
import { useHistoryStore } from "@/lib/store/historyStore";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserProfileStore } from "@/lib/store/userProfileStore";
import { FoodOutlet } from "@/types/foodOutlet";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";
import AuthDialog from "@/components/auth/AuthDialog";
import AboutModal from "@/components/layout/AboutModal";


// Canvas top locked at 31vh. WHEEL_BOTTOM derived so increasing WHEEL_SIZE
// expands the wheel downward + sideways only, never upward.
const WHEEL_SIZE = "min(75vh, 900px)";
const WHEEL_BOTTOM = `calc(56vh - ${WHEEL_SIZE})`; // = -6vh at 75vh; grows more negative as size increases
const WHEEL_RADIUS_SPACE = "54vh";

export default function Home() {
  const router = useRouter();
  const { outlets, isLoading } = useFoodOutlets();
  const { setIsSpinning, setFiltersModalOpen } = useUIStore();
  const { addEntry: addHistoryEntry } = useHistoryStore();
  const filters = useFiltersStore();
  const activeFiltersCount = filters.getActiveFiltersCount();
  const { user, signOut } = useAuthStore();
  const { profile, syncSpin, setDisplayName } = useUserProfileStore();

  const [currentOutlet, setCurrentOutlet] = useState<FoodOutlet | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [displayNameOpen, setDisplayNameOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;

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
    if (user) syncSpin(user.uid);
  };

  return (
    <Box sx={{ position: "relative", height: "100%", overflow: "hidden" }}>

      {/* Discord FAB — top-left */}
      <IconButton
        component="a"
        href="https://discord.gg/jK79hZUunv"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join Discord"
        sx={{
          position: "absolute",
          top: 14,
          left: 14,
          zIndex: 30,
          width: 36,
          height: 36,
          bgcolor: "#FFFFFF",
          border: "1.5px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          "&:hover": { bgcolor: "#EEF0FF" },
          "&:active": { transform: "scale(0.9)" },
          transition: "all 0.15s ease",
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      </IconButton>

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
            <Box sx={{ position: "relative" }}>
              <Box
                data-xp-badge
                onClick={(e) => setMenuAnchor(e.currentTarget as HTMLElement)}
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  px: 1.25,
                  py: 0.75,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: 140,
                  transition: "transform 0.15s ease",
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                {/* Top row: avatar + level + streak */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Avatar
                    src={user.photoURL || undefined}
                    alt={user.displayName || "User"}
                    sx={{ width: 26, height: 26, bgcolor: "#FF6B35", fontSize: "0.68rem", fontWeight: 700, border: "2px solid rgba(255,107,53,0.25)", flexShrink: 0 }}
                  >
                    {(profile?.displayName || user.displayName)?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.65rem", color: "#AB3500", letterSpacing: "0.04em" }}>
                    LVL {level}
                  </Typography>
                  <Box sx={{ width: "1px", height: 10, bgcolor: "rgba(139,90,60,0.25)" }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.65rem", color: "#6B7280" }}>
                    🔥 {streak}
                  </Typography>
                </Box>
                {/* XP bar */}
                {profile && (
                  <Box>
                    <Box sx={{ height: 4, bgcolor: "#F3F4F6", borderRadius: "9999px", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${(profile.xp ?? 0) % 100}%`, background: "linear-gradient(90deg, #FF6B35 0%, #FFB347 100%)", borderRadius: "9999px", transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
                    </Box>
                    <Typography sx={{ fontSize: "0.55rem", color: "#9CA3AF", textAlign: "right", mt: 0.25 }}>
                      {(profile.xp ?? 0) % 100}/100 XP
                    </Typography>
                  </Box>
                )}
              </Box>
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
                <Typography variant="body2" color="text.secondary">{profile?.displayName || user.displayName?.split(' ')[0] || user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { setDisplayNameInput(profile?.displayName || ""); setDisplayNameOpen(true); setMenuAnchor(null); }}>
                <ListItemIcon><PersonIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
                Display name
              </MenuItem>
              <MenuItem onClick={() => { setAddModalOpen(true); setMenuAnchor(null); }}>
                <ListItemIcon><AddIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
                Add Kainan
              </MenuItem>
              <MenuItem onClick={() => { setAboutOpen(true); setMenuAnchor(null); }}>
                <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
                About
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
            style={{ display: "inline-block", pointerEvents: "auto", cursor: "pointer" }}
            onClick={() => router.push(`/outlet?id=${currentOutlet.id}`)}
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
                "&:hover": { textDecoration: "underline" },
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
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <Dialog open={displayNameOpen} onClose={() => setDisplayNameOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", mx: 2 } }}>
        <DialogTitle sx={{ fontSize: "0.92rem", fontWeight: 700, pb: 1 }}>Display name</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="How should we call you?"
            value={displayNameInput}
            onChange={(e) => setDisplayNameInput(e.target.value)}
            inputProps={{ maxLength: 50 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (user) setDisplayName(user.uid, displayNameInput);
                setDisplayNameOpen(false);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setDisplayNameOpen(false)} size="small" sx={{ color: "#6B7280" }}>Cancel</Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => { if (user) setDisplayName(user.uid, displayNameInput); setDisplayNameOpen(false); }}
            sx={{ bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" }, borderRadius: "9999px", fontWeight: 700 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
