"use client";

import React, { useState } from "react";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { useAuthStore } from "@/lib/store/authStore";
import AuthDialog from "@/components/auth/AuthDialog";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";

export default function TopAppBar() {
  const { user, signOut } = useAuthStore();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [addFoodOutletOpen, setAddFoodOutletOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", maxWidth: 800, mx: "auto", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
            {user && (
              <IconButton
                onClick={() => setAddFoodOutletOpen(true)}
                aria-label="add kainan"
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    color: "#E37725",
                    backgroundColor: "rgba(255, 107, 53, 0.08)",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            )}
            {user ? (
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 53, 0.08)",
                  },
                }}
              >
                <Avatar
                  src={user.photoURL || undefined}
                  alt={user.displayName || "User"}
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#E37725",
                    color: "#FFFFFF",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <IconButton
                onClick={() => setAuthDialogOpen(true)}
                aria-label="sign in"
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    color: "#E37725",
                    backgroundColor: "rgba(255, 107, 53, 0.08)",
                  },
                }}
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
        PaperProps={{
          sx: {
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            mt: 1,
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {user?.displayName || user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          Sign Out
        </MenuItem>
        <MenuItem disabled sx={{ opacity: 0.6, justifyContent: "center" }}>
          <Typography variant="caption" color="text.secondary">
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </Typography>
        </MenuItem>
      </Menu>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
      <AddFoodOutletModal
        open={addFoodOutletOpen}
        onClose={() => setAddFoodOutletOpen(false)}
      />
    </>
  );
}
