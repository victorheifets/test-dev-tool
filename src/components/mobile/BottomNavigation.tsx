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
  ).slice(0, 5) || []; // Limit to 5 items for bottom nav

  const currentValue = navItems.find(item => 
    location.pathname === item.list || 
    (item.list === '/courses' && location.pathname === '/courses-mobile')
  )?.list || '/dashboard';

  const handleNavigation = (newValue: string) => {
    // If we're on courses-mobile and clicking courses, stay on mobile version
    if (location.pathname === '/courses-mobile' && newValue === '/courses') {
      navigate('/courses-mobile');
    } else {
      navigate(newValue);
    }
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
        sx={{ height: 70 }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.name}
            label={item.meta?.label}
            value={item.list}
            icon={item.meta?.icon}
            sx={{
              fontSize: '0.75rem',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                '&.Mui-selected': {
                  fontSize: '0.7rem',
                },
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};