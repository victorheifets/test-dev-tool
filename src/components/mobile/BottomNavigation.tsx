import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResources } from '../../config/navigation';
import { useTranslation } from 'react-i18next';

export const MobileBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const resources = useResources();

  // Filter main navigation items (exclude sections)
  const navItems = resources?.filter(resource => 
    resource.list && 
    !resource.name.startsWith('section_') &&
    resource.meta?.icon
  ) || []; // Include all main navigation items

  const currentValue = navItems.find(item => 
    location.pathname === item.list
  )?.list || '/dashboard';

  const handleNavigation = (newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderTop: '1px solid',
        borderColor: 'divider'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={currentValue}
        onChange={(event, newValue) => {
          handleNavigation(newValue);
        }}
        showLabels
        sx={{ 
          height: 80,
          '& .MuiBottomNavigationAction-root': {
            minWidth: navItems.length > 5 ? 'auto' : 64,
            padding: navItems.length > 5 ? '6px 4px' : '6px 12px',
          }
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.name}
            label={item.meta?.label}
            value={item.list}
            icon={item.meta?.icon}
            sx={{
              fontSize: navItems.length > 5 ? '0.7rem' : '0.75rem',
              '& .MuiSvgIcon-root': {
                fontSize: navItems.length > 5 ? '1.2rem' : '1.5rem',
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: navItems.length > 5 ? '0.6rem' : '0.65rem',
                '&.Mui-selected': {
                  fontSize: navItems.length > 5 ? '0.65rem' : '0.7rem',
                },
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};