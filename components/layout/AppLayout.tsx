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
        paddingTop: '64px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, rgba(152, 4, 4, 0.02) 0%, rgba(147, 189, 87, 0.02) 50%, rgba(251, 229, 128, 0.02) 100%)',
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
