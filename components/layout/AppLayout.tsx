'use client';

import React from 'react';
import Box from '@mui/material/Box';
import TopAppBar from './TopAppBar';
import BottomNavBar from './BottomNavBar';
import FiltersModal from '@/components/filters/FiltersModal';
import AuthProvider from '@/components/auth/AuthProvider';
import { useUIStore } from '@/lib/store/uiStore';
import { useGeolocation } from '@/hooks/useGeolocation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { filtersModalOpen, setFiltersModalOpen } = useUIStore();

  // Request user location on app load
  useGeolocation(true);

  return (
    <AuthProvider>
      <Box
        sx={{
          minHeight: '100vh',
          paddingTop: '64px',
          paddingBottom: '80px',
          backgroundColor: '#FAF9F7',
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
    </AuthProvider>
  );
}
