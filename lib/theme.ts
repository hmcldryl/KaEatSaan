"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF6B35",
      light: "#FF8A5B",
      dark: "#E55A2B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5F5F5",
      light: "#FFFFFF",
      dark: "#E0E0E0",
      contrastText: "#1F2937",
    },
    warning: {
      main: "#FFB547",
      light: "#FFC875",
      dark: "#E59E3F",
      contrastText: "#1F2937",
    },
    background: {
      default: "#FAF9F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: "8px",
  },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 80,
          paddingBottom: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          color: "#9CA3AF",
          "&.Mui-selected": {
            color: "#FF6B35",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
          borderRadius: "8px",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "12px 28px",
          fontSize: "0.9375rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
          },
        },
        contained: {
          backgroundColor: "#FF6B35",
          "&:hover": {
            backgroundColor: "#E55A2B",
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: "#E5E7EB",
          color: "#1F2937",
          "&:hover": {
            borderWidth: 1.5,
            borderColor: "#FF6B35",
            backgroundColor: "rgba(255, 107, 53, 0.04)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
        filled: {
          backgroundColor: "#FF6B35",
          color: "#FFFFFF",
        },
        outlined: {
          borderColor: "#E5E7EB",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#FF6B35",
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.3)",
          },
          "& .MuiSlider-track": {
            backgroundColor: "#FF6B35",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#E5E7EB",
            opacity: 1,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#FF6B35",
            "& + .MuiSwitch-track": {
              backgroundColor: "#FF6B35",
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#FAFAFA",
            "& fieldset": {
              borderColor: "#E5E7EB",
            },
            "&:hover fieldset": {
              borderColor: "#D1D5DB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF6B35",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

export default theme;
