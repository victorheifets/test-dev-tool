// Participant types for the application

export interface Participant {
  id: string;
  provider_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_info?: Record<string, any>;
  health_declaration?: any;
  terms_declaration?: any;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  enrollments_count?: number;
}

export interface ParticipantCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  profile_info?: Record<string, any>;
  health_declaration?: any;
  terms_declaration?: any;
}

export interface ParticipantUpdate extends Partial<ParticipantCreate> {
  is_active?: boolean;
} 