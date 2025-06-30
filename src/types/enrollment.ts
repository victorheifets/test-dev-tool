// Enrollment types for the application

export type EnrollmentStatus = 'enrolled' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface Enrollment {
  id: string;
  provider_id: string;
  participant_id: string;
  participant_name?: string;
  activity_id: string;
  activity_name?: string;
  status: EnrollmentStatus;
  enrollment_date: string;
  completion_date?: string;
  payment_status?: PaymentStatus;
  notes?: string;
  special_requirements?: string;
  discount_code?: string;
  referral_source?: string;
  attended_sessions?: string[];
  completion_percentage?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EnrollmentCreate {
  participant_id: string;
  activity_id: string;
  status: EnrollmentStatus;
  enrollment_date: string;
  completion_date?: string;
  payment_status: PaymentStatus;
}

export interface EnrollmentUpdate extends Partial<EnrollmentCreate> {} 