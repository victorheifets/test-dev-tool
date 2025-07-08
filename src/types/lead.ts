/**
 * Lead type definitions
 * Aligned with backend schemas exactly - July 4, 2025
 */

// Enums matching backend exactly
export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  SOCIAL_MEDIA = 'social_media', // Fixed: was 'social' in frontend
  EMAIL = 'email',
  ADVERTISEMENT = 'advertisement',
  OTHER = 'other',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  LOST = 'lost', // Added: was missing in frontend
}

// Base lead fields (matching backend LeadBase)
export interface LeadBase {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  activity_of_interest?: string; // UUID of activity they're interested in
  notes?: string;
}

// Create schema (matches backend LeadCreate)
export interface LeadCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source?: LeadSource;
  activity_of_interest?: string;
  notes?: string;
  // provider_id will be injected from headers/JWT
}

// Update schema (matches backend LeadUpdate)
export interface LeadUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  source?: LeadSource;
  status?: LeadStatus;
  activity_of_interest?: string;
  notes?: string;
  is_active?: boolean;
}

// Complete lead with all fields (matches backend Lead)
export interface Lead extends LeadBase {
  id: string;
  provider_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  is_active: boolean;
  // Computed fields
  full_name?: string;
}

// Form validation rules (matching backend validation)
export const LeadValidation = {
  first_name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[^\s].*[^\s]$/, // No leading/trailing whitespace
  },
  last_name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[^\s].*[^\s]$/, // No leading/trailing whitespace
  },
  email: {
    required: true,
    format: 'email',
  },
  phone: {
    maxLength: 20,
    pattern: /^[\d\s\-\(\)\+\.]+$/, // Digits and common phone formatting
    minDigits: 10,
  },
  activity_of_interest: {
    format: 'uuid',
  },
  notes: {
    maxLength: 2000,
  },
} as const;

// Status display helpers
export const LeadSourceLabels = {
  [LeadSource.WEBSITE]: 'Website',
  [LeadSource.REFERRAL]: 'Referral',
  [LeadSource.SOCIAL_MEDIA]: 'Social Media',
  [LeadSource.EMAIL]: 'Email',
  [LeadSource.ADVERTISEMENT]: 'Advertisement',
  [LeadSource.OTHER]: 'Other',
} as const;

export const LeadStatusLabels = {
  [LeadStatus.NEW]: 'New',
  [LeadStatus.CONTACTED]: 'Contacted',
  [LeadStatus.QUALIFIED]: 'Qualified',
  [LeadStatus.CONVERTED]: 'Converted',
  [LeadStatus.LOST]: 'Lost',
} as const;

// Status color mapping for UI
export const LeadStatusColors = {
  [LeadStatus.NEW]: 'primary',
  [LeadStatus.CONTACTED]: 'info',
  [LeadStatus.QUALIFIED]: 'warning',
  [LeadStatus.CONVERTED]: 'success',
  [LeadStatus.LOST]: 'error',
} as const; 