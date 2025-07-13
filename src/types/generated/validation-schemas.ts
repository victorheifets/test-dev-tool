// Auto-generated Zod validation schemas
// DO NOT EDIT MANUALLY - Generated from OpenAPI spec

import { z } from "zod";

// Custom validation patterns
export const ValidationPatterns = {
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^[\d\s\-\(\)\+\.]+$/, "Invalid phone format"),
  uuid: z.string().uuid("Invalid UUID format"),
  url: z.string().url("Invalid URL format"),
  currency: z.string().regex(/^[A-Z]{3}$/, "Invalid currency code"),
} as const;

// Helper functions
export const createOptionalString = (maxLength?: number) => {
  let schema = z.string().optional();
  if (maxLength) {
    schema = schema.refine(val => !val || val.length <= maxLength, {
      message: `Must be ${maxLength} characters or less`
    });
  }
  return schema;
};

export const createRequiredString = (minLength = 1, maxLength?: number) => {
  let schema = z.string().min(minLength, `Must be at least ${minLength} characters`);
  if (maxLength) {
    schema = schema.max(maxLength, `Must be ${maxLength} characters or less`);
  }
  return schema;
};

export const createNumberRange = (min?: number, max?: number) => {
  let schema = z.number();
  if (min !== undefined) {
    schema = schema.min(min, `Must be at least ${min}`);
  }
  if (max !== undefined) {
    schema = schema.max(max, `Must be at most ${max}`);
  }
  return schema;
};

export const ActivitySchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.string().optional(),
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  capacity: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  price: z.string().optional(),
  currency: ValidationPatterns.currency.optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  enrollments_count: z.number().optional(),
  available_spots: z.number().optional(),
  is_fully_booked: z.boolean().optional()
});

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityCreateSchema = z.object({
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  capacity: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  price: z.string().optional(),
  currency: ValidationPatterns.currency.optional(),
  category: z.string().optional(),
  featured: z.boolean().optional()
});

export type ActivityCreate = z.infer<typeof ActivityCreateSchema>;

export const ActivityStatusSchema = z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']);

export const ActivityTypeSchema = z.enum(['course', 'workshop', 'seminar', 'webinar', 'other']);

export const ActivityUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  capacity: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  price: z.string().optional(),
  currency: ValidationPatterns.currency.optional(),
  category: z.string().optional(),
  featured: z.string().optional(),
  is_active: z.string().optional()
});

export type ActivityUpdate = z.infer<typeof ActivityUpdateSchema>;

export const EnrollmentSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.string().optional(),
  activity_id: ValidationPatterns.uuid,
  participant_id: ValidationPatterns.uuid,
  status: z.string().optional(),
  enrollment_date: z.string().optional(),
  notes: z.string().optional(),
  special_requirements: z.string().optional(),
  days_remaining: z.string().optional()
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;

export const EnrollmentCreateSchema = z.object({
  activity_id: ValidationPatterns.uuid,
  participant_id: ValidationPatterns.uuid,
  status: z.string().optional(),
  enrollment_date: z.string().optional(),
  notes: z.string().optional(),
  special_requirements: z.string().optional()
});

export type EnrollmentCreate = z.infer<typeof EnrollmentCreateSchema>;

export const EnrollmentStatusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'waitlisted', 'no_show', 'in_progress']);

export const EnrollmentUpdateSchema = z.object({
  status: z.string().optional(),
  notes: z.string().optional(),
  special_requirements: z.string().optional(),
  is_active: z.string().optional()
});

export type EnrollmentUpdate = z.infer<typeof EnrollmentUpdateSchema>;

export const LeadSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.string().optional(),
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  activity_of_interest: z.string().optional(),
  notes: createRequiredString(1, 1000).optional(),
  full_name: z.string().optional()
});

export type Lead = z.infer<typeof LeadSchema>;

export const LeadCreateSchema = z.object({
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  activity_of_interest: z.string().optional(),
  notes: createRequiredString(1, 1000).optional()
});

export type LeadCreate = z.infer<typeof LeadCreateSchema>;

export const LeadSourceSchema = z.enum(['website', 'referral', 'social_media', 'email', 'advertisement', 'other']);

export const LeadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']);

export const LeadUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: ValidationPatterns.phone.optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  activity_of_interest: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.string().optional()
});

export type LeadUpdate = z.infer<typeof LeadUpdateSchema>;

export const ParticipantSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.string().optional(),
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  full_name: z.string().optional(),
  enrollments_count: z.number().optional()
});

export type Participant = z.infer<typeof ParticipantSchema>;

export const ParticipantCreateSchema = z.object({
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional()
});

export type ParticipantCreate = z.infer<typeof ParticipantCreateSchema>;

export const ParticipantUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: ValidationPatterns.phone.optional(),
  date_of_birth: z.string().optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  is_active: z.string().optional()
});

export type ParticipantUpdate = z.infer<typeof ParticipantUpdateSchema>;

export const ProviderSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.string().optional(),
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  website: ValidationPatterns.url.optional(),
  address: createRequiredString(1, 500).optional(),
  logo_url: z.string().optional()
});

export type Provider = z.infer<typeof ProviderSchema>;

export const ProviderCreateSchema = z.object({
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  website: ValidationPatterns.url.optional(),
  address: createRequiredString(1, 500).optional(),
  logo_url: z.string().optional()
});

export type ProviderCreate = z.infer<typeof ProviderCreateSchema>;

export const ProviderUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: ValidationPatterns.phone.optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  logo_url: z.string().optional(),
  is_active: z.string().optional()
});

export type ProviderUpdate = z.infer<typeof ProviderUpdateSchema>;

