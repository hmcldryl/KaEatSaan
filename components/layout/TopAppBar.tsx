'use client';

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import TuneIcon from '@mui/icons-material/Tune';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useFiltersStore } from '@/lib/store/filtersStore';
import { useAuthStore } from '@/lib/store/authStore';
import AuthDialog from '@/components/auth/AuthDialog';

interface TopAppBarProps {
  onFilterClick: () => void;
}

export default function TopAppBar({ onFilterClick }: TopAppBarProps) {
  const activeFiltersCount = useFiltersStore((state) => state.getActiveFiltersCount());
  const { user, signOut } = useAuthStore();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RestaurantIcon sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              KaEatSaan
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={onFilterClick}
              aria-label="filters"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <Badge
                badgeContent={activeFiltersCount}
                sx={{
                  '& .MuiBadge-badge': {
                    background: '#FBE580',
                    color: '#1F2937',
                    fontWeight: 700,
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
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <Avatar
                  src={user.photoURL || undefined}
                  alt={user.displayName || 'User'}
                  sx={{ width: 32, height: 32, bgcolor: '#FBE580', color: '#1F2937' }}
                >
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={() => setAuthDialogOpen(true)}
                aria-label="sign in"
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            {user?.displayName || user?.email}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </>
  );
}
