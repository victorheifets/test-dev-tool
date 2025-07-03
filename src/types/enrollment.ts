// Enrollment types matching backend schema

export type EnrollmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'waitlisted' | 'no_show';

export interface PaymentInfo {
  amount_paid: number;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  is_refunded: boolean;
  refund_date?: string;
  refund_amount?: number;
  invoice_id?: string;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
}

export interface FeedbackInfo {
  rating?: number;
  comments?: string;
  submitted_date?: string;
}

export interface Enrollment {
  id: string;
  provider_id: string;
  participant_id: string;
  activity_id: string;
  status: EnrollmentStatus;
  enrollment_date: string;
  notes?: string;
  attended_sessions: string[];
  payment_info: PaymentInfo;
  feedback?: FeedbackInfo;
  special_requirements?: string;
  discount_code?: string;
  referral_source?: string;
  completion_percentage: number;
  days_remaining?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface EnrollmentCreate {
  activity_id?: string;
  participant_id?: string;
  status?: EnrollmentStatus;
  notes?: string;
  attended_sessions?: string[];
  payment_info?: PaymentInfo;
  special_requirements?: string;
  discount_code?: string;
  referral_source?: string;
}

export interface EnrollmentUpdate {
  status?: EnrollmentStatus;
  notes?: string;
  attended_sessions?: string[];
  payment_info?: PaymentInfo;
  feedback?: FeedbackInfo;
  special_requirements?: string;
  discount_code?: string;
  is_active?: boolean;
} 