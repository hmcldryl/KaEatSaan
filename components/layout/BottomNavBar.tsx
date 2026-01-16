'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(0);

  // Update active nav based on pathname
  useEffect(() => {
    if (pathname === '/') setValue(0);
    else if (pathname === '/favorites') setValue(1);
    else if (pathname === '/history') setValue(2);
  }, [pathname]);

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/favorites');
        break;
      case 2:
        router.push('/history');
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleNavigation}
      showLabels
      sx={{
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        sx={{
          '&.Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 700,
            },
          },
        }}
      />
      <BottomNavigationAction
        label="Favorites"
        icon={<FavoriteIcon />}
        sx={{
          '&.Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 700,
            },
          },
        }}
      />
      <BottomNavigationAction
        label="History"
        icon={<HistoryIcon />}
        sx={{
          '&.Mui-selected': {
            '& .MuiBottomNavigationAction-label': {
              fontWeight: 700,
            },
          },
        }}
      />
    </BottomNavigation>
  );
}
