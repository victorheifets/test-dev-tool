import { useMediaQuery, useTheme } from '@mui/material';

export const useBreakpoint = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    device: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};