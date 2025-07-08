export interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'signup' | 'faq' | 'stats' | 'instructor';
  title: string;
  content: any;
  visible: boolean;
  order: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'tech' | 'business' | 'creative' | 'certification' | 'minimal';
  description: string;
  preview: string;
  features: string[];
  sections: LandingPageSection[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface LandingPageData {
  id?: string;
  course_id: string;
  title: string;
  slug: string;
  meta_description: string;
  template_id: string;
  sections: LandingPageSection[];
  customizations: Record<string, any>;
  published: boolean;
}

export interface CourseData {
  id: string;
  name: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  image?: string;
}