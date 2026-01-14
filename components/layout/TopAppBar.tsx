'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import TuneIcon from '@mui/icons-material/Tune';
import { useFiltersStore } from '@/lib/store/filtersStore';

interface TopAppBarProps {
  onFilterClick: () => void;
}

export default function TopAppBar({ onFilterClick }: TopAppBarProps) {
  const activeFiltersCount = useFiltersStore((state) => state.getActiveFiltersCount());

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          KaEatSaan
        </Typography>
        <IconButton
          color="inherit"
          onClick={onFilterClick}
          aria-label="filters"
        >
          <Badge badgeContent={activeFiltersCount} color="error">
            <TuneIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
