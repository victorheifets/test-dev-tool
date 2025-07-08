/**
 * TypeScript definitions for Landing Page System
 * Following existing project patterns for type definitions
 */

import { ReactNode } from 'react';
import { TemplateTheme } from '../lib/landing/templates';

/**
 * Base landing page data structure
 */
export interface LandingPageData {
  id: string;
  title: string;
  slug: string;
  courseId?: string;
  template: string;
  status: LandingPageStatus;
  content: LandingPageContent;
  settings: LandingPageSettings;
  formConfig: FormConfiguration;
  analytics: LandingPageAnalytics;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * Landing page status enumeration
 */
export enum LandingPageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Content sections for landing page
 */
export interface LandingPageContent {
  hero: HeroContent;
  features: FeaturesContent;
  instructor: InstructorContent;
  testimonials: TestimonialsContent;
  pricing: PricingContent;
  contact: ContactContent;
  customSections?: CustomSection[];
}

/**
 * Hero section content
 */
export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

/**
 * Features section content
 */
export interface FeaturesContent {
  title: string;
  subtitle: string;
  items: FeatureItem[];
  layout: 'grid' | 'list' | 'cards';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  order: number;
}

/**
 * Instructor section content
 */
export interface InstructorContent {
  title: string;
  name: string;
  credentials: string;
  bio: string;
  image?: string;
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

/**
 * Testimonials section content
 */
export interface TestimonialsContent {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  layout: 'carousel' | 'grid' | 'single';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  order: number;
}

/**
 * Pricing section content
 */
export interface PricingContent {
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  currency: string;
  features: string[];
  buttonText: string;
  guaranteeText?: string;
  urgencyText?: string;
}

/**
 * Contact section content
 */
export interface ContactContent {
  title: string;
  subtitle: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: SocialLink[];
  showMap?: boolean;
}

/**
 * Custom section for extensibility
 */
export interface CustomSection {
  id: string;
  type: string;
  title: string;
  content: Record<string, any>;
  order: number;
  enabled: boolean;
}

/**
 * Landing page settings and configuration
 */
export interface LandingPageSettings {
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    heroHeight: string;
    sectionPadding: string;
    containerMaxWidth: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  enabledSections: string[];
  sectionOrder: string[];
  customCss?: string;
  favicon?: string;
  ogImage?: string;
}

/**
 * Form configuration for lead capture
 */
export interface FormConfiguration {
  fields: FormField[];
  submitText: string;
  successMessage: string;
  errorMessage: string;
  redirectUrl?: string;
  emailNotifications: boolean;
  autoResponder: boolean;
  autoResponderTemplate?: string;
  webhookUrl?: string;
}

/**
 * Form field definition
 */
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: FormFieldValidation;
  order: number;
  enabled: boolean;
}

/**
 * Form field types
 */
export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  TEL = 'tel',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  NUMBER = 'number',
  DATE = 'date',
}

/**
 * Form field validation rules
 */
export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string;
}

/**
 * Analytics and metrics
 */
export interface LandingPageAnalytics {
  views: AnalyticsMetric;
  leads: AnalyticsMetric;
  conversions: AnalyticsMetric;
  bounceRate: number;
  averageTimeOnPage: number;
  topTrafficSources: TrafficSource[];
  deviceBreakdown: DeviceBreakdown;
  lastUpdated: string;
}

export interface AnalyticsMetric {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  previousMonth: number;
  changePercent: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

/**
 * Lead capture data
 */
export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  experience?: string;
  motivation?: string;
  landingPageId: string;
  courseId?: string;
  source: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  customFields?: Record<string, any>;
  submittedAt: string;
}

/**
 * Template preview data
 */
export interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  theme: TemplateTheme;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Component props interfaces
 */
export interface LandingEditorProps {
  landingPageId?: string;
  courseId?: string;
  initialData?: Partial<LandingPageData>;
  onSave: (data: LandingPageData) => Promise<void>;
  onPublish: (data: LandingPageData) => Promise<void>;
  onPreview: (data: LandingPageData) => void;
  isLoading?: boolean;
  readonly?: boolean;
}

export interface TemplateSelectProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  templates: TemplatePreview[];
  showPreview?: boolean;
}

export interface ContentEditorProps {
  content: LandingPageContent;
  template: TemplateTheme;
  onChange: (content: LandingPageContent) => void;
  section: keyof LandingPageContent;
  readonly?: boolean;
}

export interface FormBuilderProps {
  config: FormConfiguration;
  onChange: (config: FormConfiguration) => void;
  readonly?: boolean;
}

export interface LivePreviewProps {
  data: LandingPageData;
  template: TemplateTheme;
  isPublic?: boolean;
  showControls?: boolean;
  onEdit?: () => void;
}

/**
 * API response types
 */
export interface LandingPageListResponse {
  landingPages: LandingPageData[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LandingPageCreateRequest {
  title: string;
  slug: string;
  courseId?: string;
  template: string;
}

export interface LandingPageUpdateRequest {
  title?: string;
  slug?: string;
  courseId?: string;
  template?: string;
  content?: Partial<LandingPageContent>;
  settings?: Partial<LandingPageSettings>;
  formConfig?: Partial<FormConfiguration>;
  status?: LandingPageStatus;
}

export interface PublishRequest {
  publishedAt?: string;
  status: LandingPageStatus.PUBLISHED;
}

/**
 * Hook return types
 */
export interface UseLandingPageResult {
  data: LandingPageData | null;
  isLoading: boolean;
  error: string | null;
  save: (data: Partial<LandingPageData>) => Promise<void>;
  publish: () => Promise<void>;
  unpublish: () => Promise<void>;
  delete: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseTemplatesResult {
  templates: TemplatePreview[];
  isLoading: boolean;
  error: string | null;
}

export interface UseAnalyticsResult {
  analytics: LandingPageAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Error types
 */
export interface LandingPageError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

/**
 * Validation types
 */
export interface ValidationResult {
  isValid: boolean;
  errors: LandingPageError[];
  warnings: string[];
}

/**
 * Theme customization types
 */
export interface ThemeCustomization {
  colors?: Partial<TemplateTheme['colors']>;
  fonts?: Partial<TemplateTheme['fonts']>;
  spacing?: Partial<TemplateTheme['spacing']>;
  borderRadius?: Partial<TemplateTheme['borderRadius']>;
  customCss?: string;
}

/**
 * Export types for external use
 */
export type {
  TemplateTheme,
} from '../lib/landing/templates';