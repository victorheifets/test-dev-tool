// Participant types for the application

export type ParticipantStatus = 'active' | 'inactive';

export interface Participant {
  id: string;
  provider_id: string;
  name: string;
  email: string;
  phone: string;
  status: ParticipantStatus;
  created_at: string;
  updated_at?: string;
  enrollments_count: number;
}

export interface ParticipantCreate {
  name: string;
  email: string;
  phone: string;
  status: ParticipantStatus;
}

export interface ParticipantUpdate extends Partial<ParticipantCreate> {} 