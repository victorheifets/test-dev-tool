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
  is_active: z.boolean().optional(),
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  capacity: createNumberRange(1.0, 1000.0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: createRequiredString(1, 500).optional(),
  type: z.string().optional(),
  price: z.string().optional(),
  currency: ValidationPatterns.currency.optional(),
  category: createRequiredString(1, 100).optional(),
  featured: z.boolean().optional(),
  enrollments_count: z.number().optional(),
  available_spots: z.number().optional(),
  is_fully_booked: z.boolean().optional()
});

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityCreateSchema = z.object({
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 2000).optional(),
  capacity: createNumberRange(1.0, 1000.0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: createRequiredString(1, 500).optional(),
  type: z.string().optional(),
  price: createNumberRange(0.0).optional(),
  currency: ValidationPatterns.currency.optional(),
  category: createRequiredString(1, 100).optional(),
  featured: z.boolean().optional()
});

export type ActivityCreate = z.infer<typeof ActivityCreateSchema>;

export const ActivityStatusSchema = z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']);

export const ActivityTypeSchema = z.enum(['course', 'workshop', 'seminar', 'webinar', 'other']);

export const ActivityUpdateSchema = z.object({
  name: createRequiredString(1, 255).optional(),
  description: createRequiredString(1, 2000).optional(),
  capacity: createNumberRange(1.0, 1000.0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  location: createRequiredString(1, 500).optional(),
  type: z.string().optional(),
  price: createNumberRange(0.0).optional(),
  currency: ValidationPatterns.currency.optional(),
  category: createRequiredString(1, 100).optional(),
  featured: z.boolean().optional(),
  is_active: z.boolean().optional()
});

export type ActivityUpdate = z.infer<typeof ActivityUpdateSchema>;

export const EnrollmentSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.boolean().optional(),
  activity_id: ValidationPatterns.uuid,
  participant_id: ValidationPatterns.uuid,
  status: z.string().optional(),
  enrollment_date: z.string().optional(),
  notes: createRequiredString(1, 1000).optional(),
  special_requirements: createRequiredString(1, 1000).optional(),
  days_remaining: z.number().optional()
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;

export const EnrollmentCreateSchema = z.object({
  activity_id: ValidationPatterns.uuid,
  participant_id: ValidationPatterns.uuid,
  status: z.string().optional(),
  enrollment_date: z.string().optional(),
  notes: createRequiredString(1, 1000).optional(),
  special_requirements: createRequiredString(1, 1000).optional()
});

export type EnrollmentCreate = z.infer<typeof EnrollmentCreateSchema>;

export const EnrollmentStatusSchema = z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'waitlisted', 'no_show', 'in_progress']);

export const EnrollmentUpdateSchema = z.object({
  status: z.string().optional(),
  notes: createRequiredString(1, 1000).optional(),
  special_requirements: createRequiredString(1, 1000).optional(),
  is_active: z.boolean().optional()
});

export type EnrollmentUpdate = z.infer<typeof EnrollmentUpdateSchema>;

export const LeadSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.boolean().optional(),
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  activity_of_interest: ValidationPatterns.uuid.optional(),
  notes: createRequiredString(1, 2000).optional(),
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
  activity_of_interest: ValidationPatterns.uuid.optional(),
  notes: createRequiredString(1, 2000).optional()
});

export type LeadCreate = z.infer<typeof LeadCreateSchema>;

export const LeadSourceSchema = z.enum(['website', 'referral', 'social_media', 'email', 'advertisement', 'other']);

export const LeadStatusSchema = z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']);

export const LeadUpdateSchema = z.object({
  first_name: createRequiredString(1, 100).optional(),
  last_name: createRequiredString(1, 100).optional(),
  email: ValidationPatterns.email.optional(),
  phone: ValidationPatterns.phone.optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  activity_of_interest: ValidationPatterns.uuid.optional(),
  notes: createRequiredString(1, 2000).optional(),
  is_active: z.boolean().optional()
});

export type LeadUpdate = z.infer<typeof LeadUpdateSchema>;

export const ParticipantSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.boolean().optional(),
  first_name: createRequiredString(1, 100),
  last_name: createRequiredString(1, 100),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  date_of_birth: z.string().optional(),
  address: createRequiredString(1, 500).optional(),
  emergency_contact: createRequiredString(1, 100).optional(),
  emergency_phone: createRequiredString(1, 20).optional(),
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
  address: createRequiredString(1, 500).optional(),
  emergency_contact: createRequiredString(1, 100).optional(),
  emergency_phone: createRequiredString(1, 20).optional()
});

export type ParticipantCreate = z.infer<typeof ParticipantCreateSchema>;

export const ParticipantUpdateSchema = z.object({
  first_name: createRequiredString(1, 100).optional(),
  last_name: createRequiredString(1, 100).optional(),
  email: ValidationPatterns.email.optional(),
  phone: ValidationPatterns.phone.optional(),
  date_of_birth: z.string().optional(),
  address: createRequiredString(1, 500).optional(),
  emergency_contact: createRequiredString(1, 100).optional(),
  emergency_phone: createRequiredString(1, 20).optional(),
  is_active: z.boolean().optional()
});

export type ParticipantUpdate = z.infer<typeof ParticipantUpdateSchema>;

export const ProviderSchema = z.object({
  id: z.string().optional(),
  provider_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  is_active: z.boolean().optional(),
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 1000).optional(),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  website: z.string().optional(),
  address: createRequiredString(1, 500).optional(),
  logo_url: createRequiredString(1, 500).optional()
});

export type Provider = z.infer<typeof ProviderSchema>;

export const ProviderCreateSchema = z.object({
  name: createRequiredString(1, 255),
  description: createRequiredString(1, 1000).optional(),
  email: ValidationPatterns.email,
  phone: ValidationPatterns.phone.optional(),
  website: z.string().optional(),
  address: createRequiredString(1, 500).optional(),
  logo_url: createRequiredString(1, 500).optional()
});

export type ProviderCreate = z.infer<typeof ProviderCreateSchema>;

export const ProviderListResponseSchema = z.object({
  providers: z.array(z.any()),
  total: z.number()
});

export type ProviderListResponse = z.infer<typeof ProviderListResponseSchema>;

export const ProviderUpdateSchema = z.object({
  name: createRequiredString(1, 255).optional(),
  description: createRequiredString(1, 1000).optional(),
  email: ValidationPatterns.email.optional(),
  phone: ValidationPatterns.phone.optional(),
  website: z.string().optional(),
  address: createRequiredString(1, 500).optional(),
  logo_url: createRequiredString(1, 500).optional(),
  is_active: z.boolean().optional()
});

export type ProviderUpdate = z.infer<typeof ProviderUpdateSchema>;

export const UserCreateSchema = z.object({
  email: ValidationPatterns.email,
  name: createRequiredString(1, 255),
  role: z.string().optional(),
  is_active: z.boolean().optional(),
  password: createRequiredString(8, 255).optional(),
  provider_id: z.string()
});

export type UserCreate = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z.object({
  name: createRequiredString(1, 255).optional(),
  role: z.string().optional(),
  is_active: z.boolean().optional(),
  password: createRequiredString(8, 255).optional()
});

export type UserUpdate = z.infer<typeof UserUpdateSchema>;

