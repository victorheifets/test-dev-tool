// Activity types based on the real API schema

// Updated to match API schema exactly
export type ActivityStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

export type ActivityType = 'course' | 'workshop' | 'seminar' | 'webinar' | 'other';

export type ActivityLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface SessionInfo {
  start_time: string;
  end_time: string;
  location?: string;
  notes?: string;
  instructor_id?: string;
  max_capacity?: number;
  is_online: boolean;
  meeting_link?: string;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  payment_schedule?: string;
  early_bird_discount?: number;
  early_bird_deadline?: string;
  group_discount?: number;
  min_group_size?: number;
  installment_options?: any[];
  refund_policy?: string;
}

// Updated to match API schema
export interface Activity {
  id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  description?: string | null;
  capacity?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status: ActivityStatus;
  location?: string | null;
  activity_type: ActivityType;
  price?: string | null;
  currency: string;
  category?: string | null;
  enrollments_count: number;
  available_spots: number;
  is_fully_booked: boolean;
  // Legacy fields kept for backward compatibility
  sessions?: SessionInfo[];
  pricing?: PriceInfo;
  tags?: string[];
  prerequisites?: string;
  level?: ActivityLevel;
  trainer_id?: string;
  image_url?: string;
  landing_page_url?: string;
  featured?: boolean;
  registration_deadline?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  materials_included?: string[];
  learning_outcomes?: string[];
}

// Updated to match API schema - only required field is 'name'
export interface ActivityCreate {
  name: string;
  description?: string | null;
  provider_id?: string | null;
  capacity?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: ActivityStatus;
  location?: string | null;
  activity_type?: ActivityType;
  price?: string | null;
  currency?: string;
  category?: string | null;
  // Legacy fields for backward compatibility
  sessions?: SessionInfo[];
  pricing?: PriceInfo;
  tags?: string[];
  prerequisites?: string;
  level?: ActivityLevel;
  trainer_id?: string;
  image_url?: string;
  landing_page_url?: string;
  featured?: boolean;
  registration_deadline?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  materials_included?: string[];
  learning_outcomes?: string[];
}

// Updated to match API schema
export interface ActivityUpdate {
  name?: string | null;
  description?: string | null;
  capacity?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status?: ActivityStatus | null;
  location?: string | null;
  activity_type?: ActivityType | null;
  price?: string | null;
  currency?: string | null;
  category?: string | null;
  is_active?: boolean | null;
  // Legacy fields for backward compatibility
  sessions?: SessionInfo[];
  pricing?: PriceInfo;
  tags?: string[];
  prerequisites?: string;
  level?: ActivityLevel;
  trainer_id?: string;
  image_url?: string;
  landing_page_url?: string;
  featured?: boolean;
  registration_deadline?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  materials_included?: string[];
  learning_outcomes?: string[];
}