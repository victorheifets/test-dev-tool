/**
 * Enrollment type definitions
 * Aligned with backend schemas exactly - July 4, 2025
 */

// Enum matching backend exactly
export enum EnrollmentStatus {
  PENDING = 'pending',
  ENROLLED = 'enrolled',
  ACTIVE = 'active',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  WAITLISTED = 'waitlisted',
  NO_SHOW = 'no_show',
}

// Base enrollment fields (matching backend EnrollmentBase)
export interface EnrollmentBase {
  activity_id: string;
  participant_id: string;
  status: EnrollmentStatus;
  enrollment_date: string; // ISO datetime string
  notes?: string;
  special_requirements?: string;
}

// Create schema (matches backend EnrollmentCreate)
export interface EnrollmentCreate {
  activity_id: string;
  participant_id: string;
  status?: EnrollmentStatus;
  notes?: string;
  special_requirements?: string;
  // provider_id will be injected from headers/JWT
}

// Update schema (matches backend EnrollmentUpdate)
export interface EnrollmentUpdate {
  status?: EnrollmentStatus;
  notes?: string;
  special_requirements?: string;
  is_active?: boolean;
}

// Complete enrollment with all fields (matches backend Enrollment)
export interface Enrollment extends EnrollmentBase {
  id: string;
  provider_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  is_active: boolean;
  // Computed fields
  completion_percentage: number;
  days_remaining?: number;
}

// Form validation rules (matching backend validation)
export const EnrollmentValidation = {
  activity_id: {
    required: true,
    format: 'uuid',
  },
  participant_id: {
    required: true,
    format: 'uuid',
  },
  notes: {
    maxLength: 1000,
  },
  special_requirements: {
    maxLength: 1000,
  },
  completion_percentage: {
    min: 0,
    max: 100,
  },
} as const;

// Status display helpers
export const EnrollmentStatusLabels = {
  [EnrollmentStatus.PENDING]: 'Pending',
  [EnrollmentStatus.ENROLLED]: 'Enrolled',
  [EnrollmentStatus.ACTIVE]: 'Active',
  [EnrollmentStatus.CONFIRMED]: 'Confirmed',
  [EnrollmentStatus.CANCELLED]: 'Cancelled',
  [EnrollmentStatus.COMPLETED]: 'Completed',
  [EnrollmentStatus.WAITLISTED]: 'Waitlisted',
  [EnrollmentStatus.NO_SHOW]: 'No Show',
} as const;

// Status color mapping for UI
export const EnrollmentStatusColors = {
  [EnrollmentStatus.PENDING]: 'warning',
  [EnrollmentStatus.ENROLLED]: 'success',
  [EnrollmentStatus.ACTIVE]: 'primary',
  [EnrollmentStatus.CONFIRMED]: 'success',
  [EnrollmentStatus.CANCELLED]: 'error',
  [EnrollmentStatus.COMPLETED]: 'info',
  [EnrollmentStatus.WAITLISTED]: 'secondary',
  [EnrollmentStatus.NO_SHOW]: 'error',
} as const; 