// Enrollment types for the application

export type EnrollmentStatus = 'enrolled' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface Enrollment {
  id: string;
  provider_id: string;
  participant_id: string;
  participant_name: string;
  activity_id: string;
  activity_name: string;
  status: EnrollmentStatus;
  enrollment_date: string;
  completion_date?: string;
  payment_status: PaymentStatus;
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