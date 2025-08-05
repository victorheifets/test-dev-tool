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
  
  // Provider ID will be extracted from JWT token or user session
  
  // API endpoints
  endpoints: {
    activities: '/activities',
    participants: '/participants', 
    enrollments: '/enrollments',
    marketing: '/marketing/leads',
    instructors: '/trainers', // Note: not in swagger but keeping for future
    providers: '/providers',
    statistics: '/statistics',
    auth: '/auth',
    sms: '/sms',
    'registration-forms': '/registration-forms'
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
  if (id) {
    // For individual resource access, no trailing slash before ID
    return `${baseUrl}/${id}`;
  } else {
    // For list access, add trailing slash for registration-forms
    return endpoint === 'registration-forms' ? `${baseUrl}/` : baseUrl;
  }
};

// Helper function to extract provider ID from JWT token
export const getProviderIdFromToken = (): string | null => {
  const token = localStorage.getItem('auth-token');
  if (!token) return null;
  
  try {
    // Decode JWT token (basic decode, not verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.provider_id || null;
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
};

// Helper function to get auth headers with JWT token
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.headers
  };

  // Add JWT token if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    
    // Add provider ID from token if available
    const providerId = getProviderIdFromToken();
    if (providerId) {
      headers['X-Provider-ID'] = providerId;
    }
  } else if (isDevelopment) {
    // Development mode: add default provider ID for testing
    headers['X-Provider-ID'] = 'ffa6c96f-e4a2-4df2-8298-415daa45d23c';
  }

  return headers;
};

