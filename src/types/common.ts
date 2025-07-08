/**
 * Shared types, enums, and validation rules
 * Centralized constants for the entire application
 * Generated: July 4, 2025
 */

// Re-export all enums for easy access
export { ActivityStatus, ActivityType } from './activity';
export { EnrollmentStatus } from './enrollment';
export { LeadSource, LeadStatus } from './lead';

// Common base fields for all entities
export interface BaseEntity {
  id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Provider entity (different structure - uses provider_id as primary key)
export interface ProviderEntity {
  provider_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\(\)\+\.]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  noLeadingTrailingSpace: /^[^\s].*[^\s]$/,
  currencyCode: /^[A-Z]{3}$/,
  url: /^https?:\/\/.+/,
} as const;

// Common validation rules
export const CommonValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: ValidationPatterns.noLeadingTrailingSpace,
  },
  email: {
    required: true,
    format: 'email',
    pattern: ValidationPatterns.email,
  },
  phone: {
    maxLength: 20,
    pattern: ValidationPatterns.phone,
    minDigits: 10,
  },
  description: {
    maxLength: 2000,
  },
  notes: {
    maxLength: 1000,
  },
  address: {
    maxLength: 500,
  },
  website: {
    format: 'url',
    pattern: ValidationPatterns.url,
    maxLength: 2083,
  },
  currency: {
    minLength: 3,
    maxLength: 3,
    pattern: ValidationPatterns.currencyCode,
  },
} as const;

// Helper functions
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const validateUUID = (uuid: string): boolean => {
  return ValidationPatterns.uuid.test(uuid);
};

export const validateEmail = (email: string): boolean => {
  return ValidationPatterns.email.test(email);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/[\s\-\(\)\+\.]/g, '');
  return cleaned.length >= 10 && /^\d+$/.test(cleaned);
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)\+\.]/g, '');
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone; // Return original if not standard format
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: boolean;
  message: string;
  details?: any[];
  path: string;
  request_id?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
  next?: string;
}

// Default values
export const DefaultValues = {
  currency: 'USD',
  activityStatus: 'draft' as const,
  activityType: 'course' as const,
  enrollmentStatus: 'pending' as const,
  leadSource: 'website' as const,
  leadStatus: 'new' as const,
  isActive: true,
} as const;

// Field length limits (matching backend)
export const FieldLimits = {
  name: { min: 1, max: 255 },
  description: { max: 2000 },
  notes: { max: 1000 },
  address: { max: 500 },
  phone: { max: 20 },
  website: { max: 2083 },
  logoUrl: { max: 500 },
  location: { max: 500 },
  category: { max: 100 },
  capacity: { min: 1, max: 1000 },
  price: { min: 0, maxDigits: 10, decimalPlaces: 2 },
  completionPercentage: { min: 0, max: 100 },
} as const;