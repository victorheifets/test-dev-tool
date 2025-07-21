import React, { useState } from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResources } from '../../config/navigation';
import { useTranslation } from 'react-i18next';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

export const MobileBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const resources = useResources();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter main navigation items (exclude sections)
  const allNavItems = resources?.filter(resource => 
    resource.list && 
    !resource.name.startsWith('section_') &&
    resource.meta?.icon
  ) || [];

  // Split into main items (first 4) and more items (rest)
  const mainNavItems = allNavItems.slice(0, 4);
  const moreNavItems = allNavItems.slice(4);

  // Check if current path is in main items or more items
  const isInMainNav = mainNavItems.some(item => location.pathname === item.list);
  const isInMoreNav = moreNavItems.some(item => location.pathname === item.list);
  
  const currentValue = isInMainNav 
    ? location.pathname 
    : isInMoreNav 
    ? 'more' 
    : '/dashboard';

  const handleNavigation = (newValue: string) => {
    if (newValue === 'more') {
      setDrawerOpen(true);
      return;
    }
    navigate(newValue);
  };

  const handleDrawerItemClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // iOS Safari fix for bottom safe area
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderTop: '1px solid',
          borderColor: 'divider',
          pb: iOS ? 'env(safe-area-inset-bottom)' : 0,
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
              minWidth: 64,
              padding: '6px 12px',
            }
          }}
        >
          {mainNavItems.map((item) => (
            <BottomNavigationAction
              key={item.name}
              label={item.meta?.label}
              value={item.list}
              icon={item.meta?.icon}
              sx={{
                fontSize: '0.75rem',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.65rem',
                  '&.Mui-selected': {
                    fontSize: '0.7rem',
                  },
                },
              }}
            />
          ))}
          {moreNavItems.length > 0 && (
            <BottomNavigationAction
              label={t('common.more', 'More')}
              value="more"
              icon={<MoreHorizIcon />}
              sx={{
                fontSize: '0.75rem',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.65rem',
                  '&.Mui-selected': {
                    fontSize: '0.7rem',
                  },
                },
              }}
            />
          )}
        </BottomNavigation>
      </Paper>

      {/* iOS-style Bottom Sheet */}
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: 'background.paper',
            bottom: 80, // Start from bottom nav
          }
        }}
        ModalProps={{
          sx: {
            '& .MuiBackdrop-root': {
              bottom: 80,
            }
          }
        }}
      >
        {/* Handle */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            pt: 1,
            pb: 1,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: 'action.disabled',
            }}
          />
        </Box>

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 2, 
          pb: 1,
        }}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {t('navigation.more_options', 'More')}
          </Typography>
          <IconButton 
            onClick={toggleDrawer(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu Items - iOS Style */}
        <Box sx={{ px: 2, pb: 3 }}>
          {moreNavItems.map((item, index) => (
            <Box
              key={item.name}
              onClick={() => handleDrawerItemClick(item.list!)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: 2,
                px: 2,
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: location.pathname === item.list ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&:active': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Box 
                sx={{ 
                  mr: 3,
                  color: location.pathname === item.list ? 'primary.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {item.meta?.icon}
              </Box>
              <Typography 
                variant="body1"
                sx={{
                  fontWeight: location.pathname === item.list ? 600 : 400,
                  fontSize: '17px', // iOS standard
                  color: location.pathname === item.list ? 'primary.main' : 'text.primary',
                }}
              >
                {item.meta?.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </SwipeableDrawer>
    </>
  );
};