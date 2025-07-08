import { createTheme, ThemeOptions } from '@mui/material/styles';

// Design tokens for consistent theming
const designTokens = {
  borderRadius: {
    default: 8,
    button: 8, // Made consistent with default
    dialog: 8, // Made consistent with default
    none: 0,
  },
  shadows: {
    card: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
    header: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
  },
  spacing: {
    sidebarWidth: 260,
  },
  colors: {
    light: {
      sidebarBackground: '#FBFBFB',
      sidebarBorder: '#E0E0E0',
    },
    dark: {
      sidebarBackground: '#1E1E2D',
      sidebarBorder: '#3A3A5A',
    }
  }
};

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
  borderRadius: designTokens.borderRadius.default,
};

// Base theme options
const baseThemeOptions: ThemeOptions = {
  palette,
  shape,
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
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.header,
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          borderRadius: designTokens.borderRadius.none,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: designTokens.shadows.card,
          borderRadius: designTokens.borderRadius.default,
        },
      },
    },
    MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.default,
          },
          elevation1: {
            boxShadow: designTokens.shadows.card,
          }
        },
      },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.borderRadius.button,
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
            color: palette.background.paper, // Use theme color instead of hardcoded white
        }
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius.dialog,
          boxShadow: designTokens.shadows.card,
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }) => ({
                backgroundColor: designTokens.colors.light.sidebarBackground,
                color: palette.text.primary,
                ...(theme.direction === 'rtl' ? {
                  borderLeft: `1px solid ${designTokens.colors.light.sidebarBorder}`,
                  borderRight: 'none',
                } : {
                  borderRight: `1px solid ${designTokens.colors.light.sidebarBorder}`,
                  borderLeft: 'none',
                }),
                width: designTokens.spacing.sidebarWidth,
                borderRadius: designTokens.borderRadius.none,
                '& .refine-sider-collapse-button': {
                  ...(theme.direction === 'rtl' ? {
                    left: '-12px !important',
                    right: 'auto !important',
                  } : {
                    right: '-12px !important',
                    left: 'auto !important',
                  }),
                  position: 'absolute',
                  transition: 'all 0.2s ease-in-out',
                },
            })
        }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1rem',
          fontWeight: 500,
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '& .MuiListItemText-primary': {
            fontSize: '1rem',
            fontWeight: 500,
          }
        }
      }
    }
  },
};

export const lightTheme = createTheme(baseThemeOptions);

// Dark theme with consistent design tokens
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
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: designTokens.shadows.header,
              backgroundColor: '#283046', // Dark theme background
              color: '#D0D2D6', // Brighter text color for dark theme
              borderRadius: designTokens.borderRadius.none,
              '& .MuiIconButton-root': {
                color: '#D0D2D6', // Brighter icon color for dark theme
              },
            },
          },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: designTokens.colors.dark.sidebarBackground,
                    color: '#D0D2D6', // Dark theme text color
                    ...(theme.direction === 'rtl' ? {
                      borderLeft: `1px solid ${designTokens.colors.dark.sidebarBorder}`,
                      borderRight: 'none',
                    } : {
                      borderRight: `1px solid ${designTokens.colors.dark.sidebarBorder}`,
                      borderLeft: 'none',
                    }),
                    width: designTokens.spacing.sidebarWidth,
                    borderRadius: designTokens.borderRadius.none,
                    '& .refine-sider-collapse-button': {
                      ...(theme.direction === 'rtl' ? {
                        left: '-12px !important',
                        right: 'auto !important',
                      } : {
                        right: '-12px !important',
                        left: 'auto !important',
                      }),
                      position: 'absolute',
                      transition: 'all 0.2s ease-in-out',
                    },
                })
            }
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              fontSize: '1rem',
              fontWeight: 500,
            }
          }
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              '& .MuiListItemText-primary': {
                fontSize: '1rem',
                fontWeight: 500,
              }
            }
          }
        }
    }
}); 