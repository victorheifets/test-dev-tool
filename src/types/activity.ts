// Activity types based on the real API schema

export type ActivityStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'archived';

export type ActivityType = 'course' | 'workshop' | 'seminar' | 'training';

export type ActivityLevel = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface SessionInfo {
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  description?: string;
}

export interface Activity {
  id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  description: string;
  capacity: number;
  start_date: string;
  end_date: string;
  status: ActivityStatus;
  sessions: SessionInfo[];
  pricing: PriceInfo;
  location: string;
  tags: string[];
  prerequisites?: string;
  category: string;
  activity_type: ActivityType;
  level: ActivityLevel;
  trainer_id?: string;
  image_url?: string;
  landing_page_url?: string;
  featured: boolean;
  registration_deadline?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  materials_included: string[];
  learning_outcomes: string[];
  enrollments_count: number;
  available_spots: number;
  is_fully_booked: boolean;
  rating?: number;
  reviews_count: number;
}

export interface ActivityCreate {
  name: string;
  description: string;
  capacity: number;
  start_date: string;
  end_date: string;
  status?: ActivityStatus;
  pricing: PriceInfo;
  location: string;
  category: string;
  activity_type?: ActivityType;
  level?: ActivityLevel;
  trainer_id?: string;
  image_url?: string;
  featured?: boolean;
  registration_deadline?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  prerequisites?: string;
  tags?: string[];
  materials_included?: string[];
  learning_outcomes?: string[];
}

export interface ActivityUpdate extends Partial<ActivityCreate> {
  is_active?: boolean;
}