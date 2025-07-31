import { GlobalStyles } from '@mui/material';
import React from 'react';

export const GlobalStyleOverrides = () => {
  return (
    <GlobalStyles
      styles={(theme) => ({
        // Fix transparent backgrounds globally
        '.MuiCard-root': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiPaper-root': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiDialog-paper': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiPopover-paper': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiMenu-paper': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiSelect-paper': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        '.MuiAutocomplete-paper': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        
        // Improve contrast for analytics/engagement sections
        '.analytics-card': {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        },
        '.engagement-section': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(3),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        },
        '.platform-performance-row': {
          backgroundColor: theme.palette.background.paper,
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.02)' 
              : 'rgba(255, 255, 255, 0.02)',
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        
        // Calendar specific fixes
        '.calendar-container': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
        },
        '.post-scheduled': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        },
        '.platform-colors': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
        },
        '.quick-tips': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        },
        
        // Dropdown fixes
        '.MuiSelect-root': {
          backgroundColor: theme.palette.background.paper,
        },
        '.MuiAutocomplete-root .MuiInputBase-root': {
          backgroundColor: theme.palette.background.paper,
        },
        
        // AI generate section
        '.ai-generate-section': {
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[1],
        },
        
        // Dashboard transparent components fix
        '.dashboard-component': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        
        // Ensure StatCard has proper background
        '.stat-card': {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        },
        
        // Table rows contrast
        '.MuiTableRow-root': {
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.02)' 
              : 'rgba(255, 255, 255, 0.02)',
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        
        // Data grid rows contrast
        '.MuiDataGrid-row': {
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.02)' 
              : 'rgba(255, 255, 255, 0.02)',
          },
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      })}
    />
  );
};