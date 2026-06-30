"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserProfileStore } from "@/lib/store/userProfileStore";
import AuthDialog from "@/components/auth/AuthDialog";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";
import AboutModal from "@/components/layout/AboutModal";

export default function TopAppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { profile, setDisplayName } = useUserProfileStore();

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [addFoodOutletOpen, setAddFoodOutletOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [displayNameOpen, setDisplayNameOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);

  const isOutletPage = pathname === "/outlet";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleMenuClose();
  };

  const handleDisplayNameOpen = () => {
    setDisplayNameInput(profile?.displayName || "");
    setDisplayNameOpen(true);
    handleMenuClose();
  };

  const handleDisplayNameSave = () => {
    if (user) setDisplayName(user.uid, displayNameInput);
    setDisplayNameOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: 800, mx: "auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isOutletPage && (
              <IconButton
                onClick={() => router.back()}
                size="small"
                sx={{ color: "#6B7280", "&:hover": { color: "#FF6B35", bgcolor: "rgba(255,107,53,0.08)" } }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Image
              src="/logo.png"
              alt="KaEatSaan"
              height={40}
              width={43}
              style={{ height: 40, width: "auto" }}
              priority
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {user ? (
              <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0.5, "&:hover": { backgroundColor: "rgba(255, 107, 53, 0.08)" } }}
              >
                <Avatar
                  src={user.photoURL || undefined}
                  alt={profile?.displayName || user.displayName || "User"}
                  sx={{ width: 34, height: 34, bgcolor: "#FF6B35", color: "#FFFFFF", fontSize: "0.9rem", fontWeight: 600 }}
                >
                  {(profile?.displayName || user.displayName)?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <IconButton
                onClick={() => setAuthDialogOpen(true)}
                aria-label="sign in"
                sx={{ color: "#6B7280", "&:hover": { color: "#FF6B35", backgroundColor: "rgba(255, 107, 53, 0.08)" } }}
              >
                <PersonIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { borderRadius: "8px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", mt: 1 } }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {profile?.displayName || user?.displayName?.split(" ")[0] || user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleDisplayNameOpen}>
          <ListItemIcon><PersonIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
          Display name
        </MenuItem>
        <MenuItem onClick={() => { setAddFoodOutletOpen(true); handleMenuClose(); }}>
          <ListItemIcon><AddIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
          Add Kainan
        </MenuItem>
        <MenuItem onClick={() => { setAboutOpen(true); handleMenuClose(); }}>
          <ListItemIcon><InfoOutlinedIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
          About
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: "#6B7280" }} /></ListItemIcon>
          Sign Out
        </MenuItem>
        <MenuItem disabled sx={{ opacity: 0.6, justifyContent: "center" }}>
          <Typography variant="caption" color="text.secondary">
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </Typography>
        </MenuItem>
      </Menu>

      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      <AddFoodOutletModal open={addFoodOutletOpen} onClose={() => setAddFoodOutletOpen(false)} />
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
            onKeyDown={(e) => { if (e.key === "Enter") handleDisplayNameSave(); }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setDisplayNameOpen(false)} size="small" sx={{ color: "#6B7280" }}>Cancel</Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDisplayNameSave}
            sx={{ bgcolor: "#FF6B35", "&:hover": { bgcolor: "#E55A20" }, borderRadius: "9999px", fontWeight: 700 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
