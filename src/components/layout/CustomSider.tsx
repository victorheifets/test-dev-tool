import React from 'react';
import { ThemedSiderV2, ThemedSiderV2Props } from '@refinedev/mui';
import { Box } from '@mui/material';

interface CustomSiderProps extends ThemedSiderV2Props {
  Title?: React.ComponentType<any>;
}

export const CustomSider: React.FC<CustomSiderProps> = (props) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <ThemedSiderV2 
        {...props}
        render={({ collapsed, ...renderProps }) => (
          <ThemedSiderV2
            {...props}
            {...renderProps}
            collapsed={collapsed}
            sx={(theme) => ({
              '& .MuiDrawer-paper': {
                '& .refine-sider-collapse-button': {
                  ...(theme.direction === 'rtl' ? {
                    left: collapsed ? '-12px' : '-12px',
                    right: 'auto',
                  } : {
                    right: collapsed ? '-12px' : '-12px',
                    left: 'auto',
                  }),
                  position: 'absolute',
                  top: '20px',
                  zIndex: 1000,
                  transition: theme.direction === 'rtl' ? 'left 0.2s ease-in-out' : 'right 0.2s ease-in-out',
                }
              }
            })}
          />
        )}
      />
    </Box>
  );
};