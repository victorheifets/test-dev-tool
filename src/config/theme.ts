import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Shadows } from '@mui/material/styles/shadows';

// Define a common palette for reuse
const palette = {
  primary: {
    main: '#7367F0', // Updated to Materialize blue
  },
  background: {
    default: '#F8F7FA', // Light grey page background from Materialize
    paper: '#FFFFFF',    // White for cards, tables, etc.
  },
  text: {
    primary: '#6E6B7B', // Materialize primary text color
    secondary: '#B9B9C3', // Materialize secondary text color
  }
};

const shape = {
  borderRadius: 8, // Slightly smaller border radius for components like cards
};

// Define a custom shadow array to match MUI's expected type.
const shadows: Shadows = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
];

// Base theme options
const baseThemeOptions: ThemeOptions = {
  palette,
  shape,
  shadows,
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
        fontWeight: 400,
        fontSize: '0.9rem',
    },
    button: {
        fontWeight: 500,
    }
  },
  components: {
    MuiAppBar: { // Overrides for the Header
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: shape.borderRadius,
          },
          elevation1: {
            boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
          }
        },
      },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Adjusted button border radius
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
            color: '#FFFFFF',
        }
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0, // Remove rounded corners from dialogs if needed, or adjust
          boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#FBFBFB', 
                color: '#6E6B7B', 
                borderRight: '1px solid #E0E0E0',
                width: 260, // Set sidebar width
                borderRadius: 0,
            }
        }
    }
  },
};

export const lightTheme = createTheme(baseThemeOptions);

// For dark mode, we can invert or adjust colors later
export const darkTheme = createTheme({
    ...baseThemeOptions,
    palette: {
        ...baseThemeOptions.palette,
        mode: 'dark',
        primary: {
          main: '#7367F0',
        },
        background: {
            default: '#161D31',
            paper: '#283046',
        },
        text: {
            primary: '#D0D2D6',
            secondary: '#A8A9AE',
        }
    },
    components: {
        ...baseThemeOptions.components,
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1E1E2D',
                    color: '#D0D2D6',
                    borderRight: '1px solid #3A3A5A',
                    width: 260,
                    borderRadius: 0,
                }
            }
        }
    }
}); 