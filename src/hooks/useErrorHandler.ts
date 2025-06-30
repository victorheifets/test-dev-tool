import { useNotification } from '@refinedev/core';
import { useCallback } from 'react';
import { errorToNotification, successNotification, infoNotification } from '../utils/errorHandler';

/**
 * Custom hook for consistent error handling across components
 */
export const useErrorHandler = () => {
  const { open: openNotification } = useNotification();

  const handleError = useCallback(
    (error: any, context?: string) => {
      const notification = errorToNotification(error);
      openNotification?.(notification);
    },
    [openNotification]
  );

  const showSuccess = useCallback(
    (message: string, description?: string) => {
      const notification = successNotification(message, description);
      openNotification?.(notification);
    },
    [openNotification]
  );

  const showInfo = useCallback(
    (message: string, description?: string) => {
      const notification = infoNotification(message, description);
      openNotification?.(notification);
    },
    [openNotification]
  );

  return {
    handleError,
    showSuccess,
    showInfo,
  };
};