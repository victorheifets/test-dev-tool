/**
 * API Configuration for Course Management Backend
 * Handles environment-specific API endpoints and settings
 */

import { getProviderId } from './provider';

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// API Configuration
export const API_CONFIG = {
  // Base API URL - different for development and production
  baseURL: isDevelopment 
    ? 'http://localhost:8083/api' 
    : process.env.VITE_API_URL || 'https://api.coursemanagement.com/api',
  
  // API timeout in milliseconds
  timeout: 10000,
  
  // Provider ID for development (will be replaced with JWT token data)
  defaultProviderId: getProviderId(),
  
  // API endpoints
  endpoints: {
    activities: '/activities',
    participants: '/participants', 
    enrollments: '/enrollments',
    marketing: '/marketing',
    instructors: '/trainers', // Note: not in swagger but keeping for future
    providers: '/providers',
    statistics: '/statistics',
    auth: '/auth'
  },
  
  // Request headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Helper function to build full endpoint URL
export const buildApiUrl = (endpoint: keyof typeof API_CONFIG.endpoints, id?: string): string => {
  const baseUrl = API_CONFIG.baseURL + API_CONFIG.endpoints[endpoint];
  return id ? `${baseUrl}/${id}` : baseUrl;
};

// Helper function to get auth headers (placeholder for JWT implementation)
export const getAuthHeaders = (): Record<string, string> => {
  // TODO: Replace with actual JWT token from auth context
  return {
    ...API_CONFIG.headers,
    'X-Provider-ID': API_CONFIG.defaultProviderId // Development only
  };
};