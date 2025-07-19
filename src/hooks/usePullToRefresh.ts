/**
 * Pull-to-refresh hook for mobile interfaces
 * Implements native mobile app-like refresh functionality
 * 
 * @author Senior Software Architect
 * @version 1.0.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useBreakpoint } from './useBreakpoint';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance in pixels to trigger refresh
  enabled?: boolean; // Whether pull-to-refresh is enabled
  resistanceFactor?: number; // Resistance when pulling beyond threshold
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  enabled = true,
  resistanceFactor = 0.3
}: PullToRefreshOptions) => {
  const { isMobile } = useBreakpoint();
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  });

  const touchStartY = useRef<number>(0);
  const scrollElement = useRef<HTMLElement | null>(null);

  // Handle touch start
  const handleTouchStart = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    if (!enabled || !isMobile) return;
    
    const scrollTop = scrollElement.current?.scrollTop || window.scrollY;
    
    // Only start pull-to-refresh if at top of page
    if (scrollTop === 0) {
      touchStartY.current = touchEvent.touches[0].clientY;
    }
  }, [enabled, isMobile]);

  // Handle touch move
  const handleTouchMove = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    if (!enabled || !isMobile || state.isRefreshing) return;
    
    const scrollTop = scrollElement.current?.scrollTop || window.scrollY;
    const currentY = touchEvent.touches[0].clientY;
    const pullDistance = Math.max(0, currentY - touchStartY.current);

    // Only allow pull-to-refresh at top of page
    if (scrollTop === 0 && pullDistance > 0) {
      e.preventDefault(); // Prevent default scroll behavior
      
      // Apply resistance after threshold
      const adjustedDistance = pullDistance > threshold 
        ? threshold + (pullDistance - threshold) * resistanceFactor
        : pullDistance;

      setState(prev => ({
        ...prev,
        isPulling: true,
        pullDistance: adjustedDistance,
        canRefresh: pullDistance >= threshold
      }));
    }
  }, [enabled, isMobile, state.isRefreshing, threshold, resistanceFactor]);

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isMobile || state.isRefreshing) return;

    if (state.canRefresh && state.isPulling) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        isPulling: false
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull-to-refresh error:', error);
      } finally {
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
          canRefresh: false
        }));
      }
    } else {
      // Reset state if not refreshing
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [enabled, isMobile, state.isRefreshing, state.canRefresh, state.isPulling, onRefresh]);

  // Bind event listeners
  useEffect(() => {
    if (!enabled || !isMobile) return;

    const element = scrollElement.current || document;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isMobile, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Programmatic refresh function
  const refresh = useCallback(async () => {
    if (state.isRefreshing) return;

    setState(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Programmatic refresh error:', error);
    } finally {
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        pullDistance: 0,
        canRefresh: false
      }));
    }
  }, [state.isRefreshing, onRefresh]);

  return {
    ...state,
    refresh,
    setScrollElement: (element: HTMLElement | null) => {
      scrollElement.current = element;
    },
    // Style helpers for UI implementation
    refreshIndicatorStyle: {
      transform: `translateY(${state.pullDistance}px)`,
      opacity: Math.min(state.pullDistance / threshold, 1),
      transition: state.isPulling ? 'none' : 'all 0.3s ease-out'
    },
    containerStyle: {
      transform: `translateY(${state.pullDistance}px)`,
      transition: state.isPulling ? 'none' : 'all 0.3s ease-out'
    }
  };
};

export default usePullToRefresh;