/**
 * Activity type definitions
 * Aligned with backend schemas exactly - July 4, 2025
 */

// Enums matching backend exactly
export enum ActivityStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published', 
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActivityType {
  COURSE = 'course',
  WORKSHOP = 'workshop',
  SEMINAR = 'seminar', 
  WEBINAR = 'webinar',
  OTHER = 'other',
}

// Base activity fields (matching backend ActivityBase)
export interface ActivityBase {
  name: string;
  description?: string;
  capacity?: number;
  start_date?: string; // ISO date string (YYYY-MM-DD)
  end_date?: string;   // ISO date string (YYYY-MM-DD)
  status: ActivityStatus;
  location?: string;
  activity_type: ActivityType;
  price?: number; // Decimal as number for frontend
  currency: string;
  category?: string;
}

// Create schema (matches backend ActivityCreate)
export interface ActivityCreate extends ActivityBase {
  // All fields from ActivityBase
  // provider_id will be injected from headers/JWT
}

// Update schema (matches backend ActivityUpdate)
export interface ActivityUpdate {
  name?: string;
  description?: string;
  capacity?: number;
  start_date?: string;
  end_date?: string;
  status?: ActivityStatus;
  location?: string;
  activity_type?: ActivityType;
  price?: number;
  currency?: string;
  category?: string;
  is_active?: boolean;
}

// Complete activity with all fields (matches backend Activity)
export interface Activity extends ActivityBase {
  id: string;
  provider_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  is_active: boolean;
  // Computed fields
  enrollments_count: number;
  available_spots: number;
  is_fully_booked: boolean;
}

// Form validation rules (matching backend validation)
export const ActivityValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  description: {
    maxLength: 2000,
  },
  capacity: {
    min: 1,
    max: 1000,
  },
  start_date: {
    format: 'date', // YYYY-MM-DD
  },
  end_date: {
    format: 'date', // YYYY-MM-DD
    mustBeAfter: 'start_date',
  },
  location: {
    maxLength: 500,
  },
  price: {
    min: 0,
    maxDigits: 10,
    decimalPlaces: 2,
  },
  currency: {
    minLength: 3,
    maxLength: 3,
    pattern: /^[A-Z]{3}$/, // ISO currency codes
  },
  category: {
    maxLength: 100,
  },
} as const;

// Status display helpers
export const ActivityStatusLabels = {
  [ActivityStatus.DRAFT]: 'Draft',
  [ActivityStatus.PUBLISHED]: 'Published',
  [ActivityStatus.ONGOING]: 'Ongoing',
  [ActivityStatus.COMPLETED]: 'Completed',
  [ActivityStatus.CANCELLED]: 'Cancelled',
} as const;

export const ActivityTypeLabels = {
  [ActivityType.COURSE]: 'Course',
  [ActivityType.WORKSHOP]: 'Workshop', 
  [ActivityType.SEMINAR]: 'Seminar',
  [ActivityType.WEBINAR]: 'Webinar',
  [ActivityType.OTHER]: 'Other',
} as const;