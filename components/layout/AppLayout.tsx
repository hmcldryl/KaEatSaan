'use client';

import React from 'react';
import Box from '@mui/material/Box';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import FiltersModal from '@/components/filters/FiltersModal';
import { useUIStore } from '@/lib/store/uiStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { filtersModalOpen, setFiltersModalOpen } = useUIStore();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        paddingTop: '64px', // Account for top app bar height
        paddingBottom: '80px', // Account for bottom navigation height
        backgroundColor: 'background.default',
      }}
    >
      <TopAppBar onFilterClick={() => setFiltersModalOpen(true)} />
      {children}
      <BottomNavBar />
      <FiltersModal
        open={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
      />
    </Box>
  );
}
