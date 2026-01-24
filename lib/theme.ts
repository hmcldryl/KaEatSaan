'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#980404',
      light: '#B91C1C',
      dark: '#7F0000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#93BD57',
      light: '#A8CC72',
      dark: '#7DA042',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FBE580',
      light: '#FCED9F',
      dark: '#E6CE5E',
      contrastText: '#212121',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 80,
          paddingBottom: 16,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(135deg, rgba(152, 4, 4, 0.02) 0%, rgba(147, 189, 87, 0.02) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(152, 4, 4, 0.1)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          color: '#6B7280',
          '&.Mui-selected': {
            color: '#980404',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #980404 0%, #B91C1C 100%)',
          boxShadow: '0 4px 20px rgba(152, 4, 4, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 20,
          border: '1px solid rgba(152, 4, 4, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #980404 0%, #B91C1C 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7F0000 0%, #980404 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
        filled: {
          background: 'linear-gradient(135deg, #980404 0%, #B91C1C 100%)',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            boxShadow: '0 2px 8px rgba(152, 4, 4, 0.3)',
          },
          '& .MuiSlider-track': {
            background: 'linear-gradient(90deg, #980404 0%, #B91C1C 100%)',
          },
          '& .MuiSlider-rail': {
            opacity: 0.2,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#93BD57',
            '& + .MuiSwitch-track': {
              backgroundColor: '#93BD57',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

export default theme;
