'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import TuneIcon from '@mui/icons-material/Tune';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useFiltersStore } from '@/lib/store/filtersStore';

interface TopAppBarProps {
  onFilterClick: () => void;
}

export default function TopAppBar({ onFilterClick }: TopAppBarProps) {
  const activeFiltersCount = useFiltersStore((state) => state.getActiveFiltersCount());

  return (
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
      </Toolbar>
    </AppBar>
  );
}
