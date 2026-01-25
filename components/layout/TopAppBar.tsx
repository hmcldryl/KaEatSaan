"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import TuneIcon from "@mui/icons-material/Tune";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import { useFiltersStore } from "@/lib/store/filtersStore";
import { useAuthStore } from "@/lib/store/authStore";
import AuthDialog from "@/components/auth/AuthDialog";
import AddFoodOutletModal from "@/components/food_outlet/AddFoodOutletModal";

interface TopAppBarProps {
  onFilterClick: () => void;
}

export default function TopAppBar({ onFilterClick }: TopAppBarProps) {
  const activeFiltersCount = useFiltersStore((state) =>
    state.getActiveFiltersCount(),
  );
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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A5B 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 22, color: "white" }} />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                letterSpacing: "-0.02em",
                color: "#1F2937",
              }}
            >
              KaEatSaan
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {user && (
              <IconButton
                onClick={() => setAddFoodOutletOpen(true)}
                aria-label="add kainan"
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    color: "#FF6B35",
                    backgroundColor: "rgba(255, 107, 53, 0.08)",
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            )}
            <IconButton
              onClick={onFilterClick}
              aria-label="filters"
              sx={{
                color: "#6B7280",
                "&:hover": {
                  color: "#FF6B35",
                  backgroundColor: "rgba(255, 107, 53, 0.08)",
                },
              }}
            >
              <Badge
                badgeContent={activeFiltersCount}
                sx={{
                  "& .MuiBadge-badge": {
                    background: "#FF6B35",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  },
                }}
              >
                <TuneIcon />
              </Badge>
            </IconButton>
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
                    bgcolor: "#FF6B35",
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
                    color: "#FF6B35",
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
