"use client";

import { createTheme } from "@mui/material/styles";

const PRIMARY = "#E37725";
const PRIMARY_LIGHT = "#F59842";
const PRIMARY_DARK = "#C4621B";
const PRIMARY_SHADOW = "rgba(227, 119, 37, 0.25)";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: PRIMARY,
      light: PRIMARY_LIGHT,
      dark: PRIMARY_DARK,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F5F0EB",
      light: "#FFF8F2",
      dark: "#E8DDD4",
      contrastText: "#1F2937",
    },
    warning: {
      main: "#F5C842",
      light: "#F9D96A",
      dark: "#D4A820",
      contrastText: "#1F2937",
    },
    background: {
      default: "#FFF8F2",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
    divider: "#F0DFD0",
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
    borderRadius: 16,
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
          borderTop: "1px solid #F0DFD0",
          boxShadow: "0 -4px 24px rgba(227, 119, 37, 0.08)",
          borderRadius: "20px 20px 0 0",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          color: "#9CA3AF",
          "&.Mui-selected": {
            color: PRIMARY,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1F2937",
          boxShadow: "none",
          borderBottom: "1px solid #F0DFD0",
          borderRadius: "0 0 20px 20px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 16px rgba(227, 119, 37, 0.07)",
          borderRadius: "20px",
          border: "1px solid #F0DFD0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          padding: "12px 28px",
          fontSize: "0.9375rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: `0 4px 16px ${PRIMARY_SHADOW}`,
          },
        },
        contained: {
          backgroundColor: PRIMARY,
          "&:hover": {
            backgroundColor: PRIMARY_DARK,
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: "#F0DFD0",
          color: "#1F2937",
          "&:hover": {
            borderWidth: 1.5,
            borderColor: PRIMARY,
            backgroundColor: "rgba(227, 119, 37, 0.04)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
        filled: {
          backgroundColor: PRIMARY,
          color: "#FFFFFF",
        },
        outlined: {
          borderColor: "#F0DFD0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
        rounded: {
          borderRadius: "20px",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(227, 119, 37, 0.12)",
          border: "1px solid #F0DFD0",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: PRIMARY,
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            boxShadow: `0 2px 8px ${PRIMARY_SHADOW}`,
          },
          "& .MuiSlider-track": {
            backgroundColor: PRIMARY,
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#F0DFD0",
            opacity: 1,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: PRIMARY,
            "& + .MuiSwitch-track": {
              backgroundColor: PRIMARY,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0 24px 64px rgba(227, 119, 37, 0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            backgroundColor: "#FFF8F2",
            "& fieldset": {
              borderColor: "#F0DFD0",
            },
            "&:hover fieldset": {
              borderColor: PRIMARY_LIGHT,
            },
            "&.Mui-focused fieldset": {
              borderColor: PRIMARY,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: PRIMARY,
          color: "#FFFFFF",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY,
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
