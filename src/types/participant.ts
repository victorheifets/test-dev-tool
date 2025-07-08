/**
 * Participant type definitions
 * Aligned with backend schemas exactly - July 4, 2025
 */

// Base participant fields (matching backend ParticipantBase)
export interface ParticipantBase {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string; // ISO date string (YYYY-MM-DD)
  address?: string;
}

// Create schema (matches backend ParticipantCreate)
export interface ParticipantCreate extends ParticipantBase {
  // All fields from ParticipantBase
  // provider_id will be injected from headers/JWT
}

// Update schema (matches backend ParticipantUpdate)
export interface ParticipantUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  is_active?: boolean;
}

// Complete participant with all fields (matches backend Participant)
export interface Participant extends ParticipantBase {
  id: string;
  provider_id: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  is_active: boolean;
  // Computed fields
  full_name?: string;
  enrollments_count: number;
}

// Form validation rules (matching backend validation)
export const ParticipantValidation = {
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
  date_of_birth: {
    format: 'date', // YYYY-MM-DD
    maxDate: 'today', // Cannot be in future
  },
  address: {
    maxLength: 500,
  },
} as const;

// Helper functions
export const formatParticipantName = (participant: Pick<Participant, 'first_name' | 'last_name'>) => {
  return `${participant.first_name.trim()} ${participant.last_name.trim()}`;
};

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/[\s\-\(\)\+\.]/g, '');
  return cleaned.length >= 10 && /^\d+$/.test(cleaned);
}; 