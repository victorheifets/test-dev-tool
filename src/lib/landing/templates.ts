/**
 * Landing Page Template System
 * Defines 5 professional templates with predefined layouts, colors, and styling
 */

export interface TemplateTheme {
  name: string;
  description: string;
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
  gradients: {
    hero: string;
    section: string;
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
  shadows: {
    card: string;
    hero: string;
    button: string;
  };
}

export const LANDING_TEMPLATES: Record<string, TemplateTheme> = {
  professional: {
    name: 'Professional',
    description: 'Clean, corporate design perfect for business courses',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
    },
    fonts: {
      heading: '"Inter", "Roboto", sans-serif',
      body: '"Inter", "Roboto", sans-serif',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      section: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    spacing: {
      heroHeight: '120px',
      sectionPadding: '80px',
      containerMaxWidth: '1200px',
    },
    borderRadius: {
      small: '8px',
      medium: '12px',
      large: '20px',
    },
    shadows: {
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hero: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      button: '0 4px 14px 0 rgba(37, 99, 235, 0.2)',
    },
  },
  
  creative: {
    name: 'Creative',
    description: 'Bold, artistic design for creative and design courses',
    colors: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      accent: '#a855f7',
      background: '#ffffff',
      surface: '#faf5ff',
      text: '#1f2937',
      textSecondary: '#6b7280',
    },
    fonts: {
      heading: '"Montserrat", "Poppins", sans-serif',
      body: '"Source Sans Pro", "Open Sans", sans-serif',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
      section: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    },
    spacing: {
      heroHeight: '140px',
      sectionPadding: '100px',
      containerMaxWidth: '1280px',
    },
    borderRadius: {
      small: '12px',
      medium: '16px',
      large: '24px',
    },
    shadows: {
      card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      hero: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      button: '0 4px 14px 0 rgba(124, 58, 237, 0.25)',
    },
  },
  
  minimal: {
    name: 'Minimal',
    description: 'Clean, minimalist design focusing on content clarity',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#4b5563',
    },
    fonts: {
      heading: '"Inter", "System UI", sans-serif',
      body: '"Inter", "System UI", sans-serif',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      section: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    },
    spacing: {
      heroHeight: '100px',
      sectionPadding: '60px',
      containerMaxWidth: '1100px',
    },
    borderRadius: {
      small: '6px',
      medium: '10px',
      large: '16px',
    },
    shadows: {
      card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      hero: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      button: '0 2px 8px 0 rgba(5, 150, 105, 0.15)',
    },
  },
  
  tech: {
    name: 'Tech',
    description: 'Modern, sleek design perfect for technology courses',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#ffffff',
      surface: '#f0f9ff',
      text: '#0f172a',
      textSecondary: '#475569',
    },
    fonts: {
      heading: '"JetBrains Mono", "Fira Code", monospace',
      body: '"Inter", "Roboto", sans-serif',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      section: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    },
    spacing: {
      heroHeight: '110px',
      sectionPadding: '70px',
      containerMaxWidth: '1200px',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    shadows: {
      card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hero: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      button: '0 4px 14px 0 rgba(14, 165, 233, 0.2)',
    },
  },
  
  bold: {
    name: 'Bold',
    description: 'High-contrast, attention-grabbing design for high-impact courses',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444',
      background: '#ffffff',
      surface: '#fef2f2',
      text: '#1f2937',
      textSecondary: '#374151',
    },
    fonts: {
      heading: '"Oswald", "Roboto Condensed", sans-serif',
      body: '"Open Sans", "Roboto", sans-serif',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
      section: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    },
    spacing: {
      heroHeight: '130px',
      sectionPadding: '90px',
      containerMaxWidth: '1300px',
    },
    borderRadius: {
      small: '6px',
      medium: '12px',
      large: '20px',
    },
    shadows: {
      card: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      hero: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      button: '0 4px 14px 0 rgba(220, 38, 38, 0.25)',
    },
  },
};

/**
 * Free stock images for templates
 * High-quality images from Unsplash with proper attribution
 */
export const TEMPLATE_IMAGES = {
  hero: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1080&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1920&h=1080&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&h=1080&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1920&h=1080&fit=crop&crop=faces',
  ],
  instructor: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
  ],
  features: [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  ],
};

/**
 * Default content for new landing pages
 */
export const DEFAULT_CONTENT = {
  hero: {
    title: 'Transform Your Skills with Our Expert Course',
    subtitle: 'Join thousands of students who have advanced their careers with our comprehensive training program',
    description: 'Learn from industry experts and gain practical skills that employers value. Our hands-on approach ensures you\'re job-ready from day one.',
    buttonText: 'Start Learning Today',
  },
  features: {
    title: 'Why Choose Our Course',
    subtitle: 'Everything you need to succeed in your learning journey',
    items: [
      {
        title: 'Expert Instruction',
        description: 'Learn from industry professionals with years of real-world experience',
      },
      {
        title: 'Hands-on Projects',
        description: 'Build a portfolio of real projects that showcase your skills to employers',
      },
      {
        title: 'Career Support',
        description: 'Get job placement assistance and career guidance throughout your journey',
      },
      {
        title: 'Flexible Learning',
        description: 'Study at your own pace with lifetime access to course materials',
      },
    ],
  },
  instructor: {
    title: 'Meet Your Instructor',
    name: 'Expert Instructor',
    credentials: 'Senior Developer & Industry Expert',
    bio: 'With over 10 years of experience in the industry, our instructor brings real-world knowledge and practical insights to help you succeed in your career.',
  },
  pricing: {
    title: 'Ready to Get Started?',
    subtitle: 'Choose the perfect plan for your learning goals',
    price: '299',
    originalPrice: '399',
    currency: 'USD',
    features: [
      'Complete course access',
      'Downloadable resources',
      'Certificate of completion',
      '30-day money-back guarantee',
      'Community access',
    ],
    buttonText: 'Enroll Now',
  },
};

/**
 * Template layout configurations
 */
export const TEMPLATE_LAYOUTS = {
  sections: [
    { id: 'hero', name: 'Hero Section', required: true, order: 0 },
    { id: 'features', name: 'Course Features', required: false, order: 1 },
    { id: 'instructor', name: 'About Instructor', required: false, order: 2 },
    { id: 'testimonials', name: 'Student Reviews', required: false, order: 3 },
    { id: 'pricing', name: 'Pricing & Enrollment', required: true, order: 4 },
    { id: 'contact', name: 'Contact Information', required: false, order: 5 },
  ],
};

/**
 * Form field configurations for lead capture
 */
export const FORM_FIELD_OPTIONS = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
  { name: 'company', label: 'Company', type: 'text', required: false },
  { name: 'jobTitle', label: 'Job Title', type: 'text', required: false },
  { name: 'experience', label: 'Years of Experience', type: 'select', required: false },
  { name: 'motivation', label: 'Learning Goals', type: 'textarea', required: false },
];

/**
 * Utility function to get template by key
 */
export function getTemplate(templateKey: string): TemplateTheme | null {
  return LANDING_TEMPLATES[templateKey] || null;
}

/**
 * Utility function to get all template keys
 */
export function getTemplateKeys(): string[] {
  return Object.keys(LANDING_TEMPLATES);
}

/**
 * Utility function to get random template image
 */
export function getRandomImage(category: keyof typeof TEMPLATE_IMAGES): string {
  const images = TEMPLATE_IMAGES[category];
  return images[Math.floor(Math.random() * images.length)];
}