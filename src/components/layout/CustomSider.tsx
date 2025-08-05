import React from 'react';
import { ThemedSiderV2, ThemedSiderV2Props } from "@refinedev/mui";
import { useTranslation } from 'react-i18next';
import { useLogout } from '@refinedev/core';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box
} from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout";

interface CustomSiderProps extends ThemedSiderV2Props {
  Title: React.ComponentType<{ collapsed: boolean }>;
}

export const CustomSider: React.FC<CustomSiderProps> = ({ Title, ...props }) => {
  const { t, i18n } = useTranslation();
  const { mutate: logout } = useLogout();

  // Get logout text with fallback
  const getLogoutText = () => {
    // Try different translation keys
    let logoutText = t('buttons.logout');
    if (logoutText === 'buttons.logout') {
      logoutText = t('header.logout');
    }
    if (logoutText === 'header.logout') {
      return i18n.language === 'he' ? 'התנתק' : 'Logout';
    }
    return logoutText;
  };

  const handleLogout = () => {
    logout();
  };

  // Custom render function to override the logout button
  const render = ({ items, logout: refineLogout, collapsed }: any) => {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Items */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box component="nav">
            <Box component="ul" sx={{ 
              listStyle: 'none', 
              p: 0, 
              m: 0,
              '& .MuiListItemButton-root': {
                borderRadius: 0,
              }
            }}>
              {items}
            </Box>
          </Box>
        </Box>

        {/* Custom Logout Button */}
        <Box sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              py: 1.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary={getLogoutText()}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }
                }}
              />
            )}
          </ListItemButton>
        </Box>
      </Box>
    );
  };

  return (
    <ThemedSiderV2 
      {...props} 
      Title={Title}
      render={render}
    />
  );
};