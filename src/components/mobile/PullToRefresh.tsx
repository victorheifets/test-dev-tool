/**
 * Pull-to-Refresh Component
 * Provides native mobile app-like refresh functionality
 * 
 * @author Senior Software Architect
 * @version 1.0.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useTranslation } from 'react-i18next';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  enabled?: boolean;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  enabled = true,
  className
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    canRefresh,
    setScrollElement,
    refreshIndicatorStyle,
    containerStyle
  } = usePullToRefresh({
    onRefresh,
    threshold,
    enabled
  });

  // Check if content actually needs scrolling
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const hasVerticalOverflow = contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setNeedsScroll(hasVerticalOverflow);
      }
    };

    // Initial check
    checkOverflow();
    
    // Check on window resize
    const handleResize = () => setTimeout(checkOverflow, 100);
    window.addEventListener('resize', handleResize);
    
    // Check when children change (new data loaded)
    let observer: MutationObserver | null = null;
    if (contentRef.current) {
      observer = new MutationObserver(checkOverflow);
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [children]);

  // Calculate rotation for refresh icon
  const iconRotation = Math.min((pullDistance / threshold) * 180, 180);

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden', // Force hide any scrollbars
        height: '100vh', // Full viewport height
        '&::-webkit-scrollbar': { display: 'none' }, // Hide webkit scrollbars
        scrollbarWidth: 'none', // Hide Firefox scrollbars
        ...containerStyle
      }}
    >
      {/* Pull-to-refresh indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: -threshold,
          left: 0,
          right: 0,
          height: threshold,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 1000,
          ...refreshIndicatorStyle
        }}
      >
        {isRefreshing ? (
          <>
            <CircularProgress 
              size={24} 
              sx={{ color: theme.palette.primary.main }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              {t('common.refreshing', 'Refreshing...')}
            </Typography>
          </>
        ) : (
          <>
            <RefreshIcon 
              sx={{ 
                fontSize: 24,
                color: canRefresh ? theme.palette.primary.main : theme.palette.text.secondary,
                transform: `rotate(${iconRotation}deg)`,
                transition: 'color 0.2s ease-out'
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: canRefresh ? theme.palette.primary.main : theme.palette.text.secondary,
                fontSize: '0.75rem',
                fontWeight: 500,
                transition: 'color 0.2s ease-out'
              }}
            >
              {canRefresh 
                ? t('common.release_to_refresh', 'Release to refresh')
                : t('common.pull_to_refresh', 'Pull to refresh')
              }
            </Typography>
          </>
        )}
      </Box>

      {/* Content */}
      <Box 
        ref={(element) => {
          contentRef.current = element;
          setScrollElement(element);
        }}
        sx={{ 
          height: '100%',
          overflow: 'hidden !important', // Force hide all overflow with !important
          '&::-webkit-scrollbar': { display: 'none !important' }, // Force hide webkit scrollbars
          scrollbarWidth: 'none !important', // Force hide Firefox scrollbars
          '&': {
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PullToRefresh;