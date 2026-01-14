'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35',    // Vibrant orange (food/appetite color)
      light: '#FF8C5F',
      dark: '#E64A1A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4',    // Teal (complementary)
      light: '#7DD9D2',
      dark: '#3BA39C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    button: {
      textTransform: 'none',  // More modern look
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,  // Rounded corners (MD3 style)
  },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 80,
          paddingBottom: 16,  // Account for iPhone home indicator
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          '&.Mui-selected': {
            color: '#FF6B35',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
          },
        },
      },
    },
  },
});

export default theme;
