import React from 'react';
import { ThemedSiderV2 } from '@refinedev/mui';

export const CustomSider: React.FC<any> = (props) => {
  return (
    <ThemedSiderV2 
      {...props}
      sx={(theme: any) => ({
        '& .MuiDrawer-paper': {
          '& .refine-sider-collapse-button': {
            position: 'absolute',
            top: '20px',
            zIndex: 1000,
            transition: 'all 0.2s ease-in-out',
          }
        }
      })}
    />
  );
};