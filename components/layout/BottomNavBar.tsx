'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
const NAV = [
  { Icon: HomeIcon, path: '/', label: 'Home' },
  { Icon: FavoriteIcon, path: '/favorites', label: 'Favorites' },
  { Icon: HistoryIcon, path: '/history', label: 'History' },
] as const;

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '24px',
        left: 0,
        right: 0,
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'center',
        px: '20px',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 0.5,
          px: 1,
          py: 0.75,
          width: '100%',
          maxWidth: { xs: '360px', sm: '420px' },
          pointerEvents: 'auto',
        }}
      >
        {NAV.map(({ Icon, path, label }) => {
          const active = pathname === path;
          return (
            <IconButton
              key={path}
              onClick={() => router.push(path)}
              aria-label={label}
              sx={{
                width: 48,
                height: 48,
                borderRadius: '9999px',
                backgroundColor: active ? '#FF6B35' : 'transparent',
                color: active ? '#ffffff' : '#9CA3AF',
                boxShadow: active ? '0 4px 12px rgba(255, 107, 53, 0.4)' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: active ? '#E55A20' : 'rgba(255, 107, 53, 0.08)',
                  color: active ? '#ffffff' : '#FF6B35',
                },
                '&:active': { transform: 'scale(0.88)' },
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
            </IconButton>
          );
        })}
      </Box>
    </Box>
  );
}
