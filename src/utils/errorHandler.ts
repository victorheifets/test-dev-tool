import { OpenNotificationParams } from '@refinedev/core';

/**
 * Centralized error handling utilities
 * Provides consistent error messaging and logging
 */

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Parse error from various sources (API, network, etc.)
 */
export const parseError = (error: any): ApiError => {
  // If it's already our AppError, use it directly
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    };
  }

  // Network or fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'errors.network_failed',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  }

  // Generic Error object
  if (error instanceof Error) {
    return {
      message: error.message || 'errors.unexpected',
      code: 'GENERIC_ERROR',
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR',
    };
  }

  // API error response
  if (error && typeof error === 'object') {
    return {
      message: error.message || error.detail || 'errors.generic',
      status: error.status || error.statusCode,
      code: error.code || error.error_code,
      details: error.details || error,
    };
  }

  // Fallback
  return {
    message: 'errors.unknown',
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Convert error to notification parameters
 */
export const errorToNotification = (error: any, t?: (key: string) => string): OpenNotificationParams => {
  const parsedError = parseError(error);
  
  let message = t ? t('errors.title.default') : 'Error';
  let description = parsedError.message;
  
  // If we have a translation function, translate the description if it's a key
  if (t && description.startsWith('errors.')) {
    description = t(description);
  }
  
  // Customize messages based on error types
  switch (parsedError.code) {
    case 'NETWORK_ERROR':
      message = t ? t('errors.title.connection') : 'Connection Error';
      break;
    case 'VALIDATION_ERROR':
      message = t ? t('errors.title.validation') : 'Validation Error';
      break;
    case 'AUTH_ERROR':
      message = t ? t('errors.title.authentication') : 'Authentication Error';
      break;
    case 'PERMISSION_ERROR':
      message = t ? t('errors.title.permission') : 'Permission Error';
      break;
    default:
      if (parsedError.status) {
        if (parsedError.status >= 400 && parsedError.status < 500) {
          message = t ? t('errors.title.client') : 'Client Error';
        } else if (parsedError.status >= 500) {
          message = t ? t('errors.title.server') : 'Server Error';
        }
      }
  }

  return {
    type: 'error',
    message,
    description,
  };
};

/**
 * Log error for debugging
 */
export const logError = (error: any, context?: string): void => {
  const parsedError = parseError(error);
  const prefix = context ? `[${context}]` : '[Error]';
  
  console.error(`${prefix} ${parsedError.message}`, {
    status: parsedError.status,
    code: parsedError.code,
    details: parsedError.details,
    originalError: JSON.stringify(error, null, 2),
  });
};

/**
 * Create success notification
 */
export const successNotification = (message: string, description?: string): OpenNotificationParams => ({
  type: 'success',
  message,
  description,
});

/**
 * Create info notification
 */
export const infoNotification = (message: string, description?: string): OpenNotificationParams => ({
  type: 'success',
  message,
  description,
});

/**
 * Handle async operations with error catching
 */
export const withErrorHandler = async <T>(
  operation: () => Promise<T>,
  context: string,
  onError?: (error: ApiError) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const parsedError = parseError(error);
    logError(error, context);
    
    if (onError) {
      onError(parsedError);
    }
    
    return null;
  }
};