/**
 * Flexible enrollment types for supporting multiple enrollment workflows
 */

import { EnrollmentStatus } from './enrollment';
import { ParticipantCreate } from './participant';

// Enrollment mode selection
export type EnrollmentMode = 'existing' | 'new' | 'from_lead';

// Base enrollment data common to all modes
export interface BaseEnrollmentData {
  activity_id: string;
  status: EnrollmentStatus;
  notes?: string;
}

// Mode-specific data interfaces
export interface ExistingParticipantEnrollment extends BaseEnrollmentData {
  mode: 'existing';
  participant_id: string;
}

export interface NewParticipantEnrollment extends BaseEnrollmentData {
  mode: 'new';
  participant_data: ParticipantCreate;
}

export interface LeadConversionEnrollment extends BaseEnrollmentData {
  mode: 'from_lead';
  lead_id: string;
}

// Union type for all enrollment modes
export type FlexibleEnrollmentData = 
  | ExistingParticipantEnrollment 
  | NewParticipantEnrollment 
  | LeadConversionEnrollment;

// Form state for enrollment modal
export interface EnrollmentFormState {
  mode: EnrollmentMode;
  selectedParticipantId?: string;
  selectedLeadId?: string;
  participantData?: ParticipantCreate;
  enrollmentData: BaseEnrollmentData;
}

// Search/autocomplete interfaces
export interface ParticipantOption {
  value: string;
  label: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

export interface LeadOption {
  value: string;
  label: string;
  email: string;
  phone?: string;
  status: string;
  activity_of_interest?: string;
}

// API response types
export interface LeadConversionResponse {
  lead: any; // Lead object
  participant: any; // Participant object  
  message: string;
}

export interface FlexibleEnrollmentResponse {
  enrollment: any; // Enrollment object
  participant: any; // Participant object
  created_participant?: boolean; // If new participant was created
  converted_lead?: boolean; // If lead was converted
}