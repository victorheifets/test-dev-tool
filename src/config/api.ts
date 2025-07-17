/**
 * API Configuration for Course Management Backend
 * Handles environment-specific API endpoints and settings
 */

import { getProviderId } from './provider';

// Environment configuration
const isDevelopment = import.meta.env.DEV;

// API Configuration
export const API_CONFIG = {
  // Base API URL - different for development and production
  baseURL: isDevelopment 
    ? 'http://localhost:8082/api' 
    : 'https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod/api',
  
  // API timeout in milliseconds
  timeout: 10000,
  
  // Provider ID for development (will be replaced with JWT token data)
  defaultProviderId: 'af333f3e-1007-424c-93d5-4dfde7407674',
  
  // API endpoints
  endpoints: {
    activities: '/activities',
    participants: '/participants', 
    enrollments: '/enrollments',
    marketing: '/marketing/leads',
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

// Helper function to get auth headers with JWT token
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    'X-Provider-ID': API_CONFIG.defaultProviderId // For multi-tenant support
  };

  // Add JWT token if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

