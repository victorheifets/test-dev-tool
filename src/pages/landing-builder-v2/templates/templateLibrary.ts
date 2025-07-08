import { Template } from '../types';

export const templateLibrary: Template[] = [
  {
    id: 'tech-course',
    name: 'Tech Course Hero',
    category: 'tech',
    description: 'Perfect for programming, web development, and technical courses. Features code-friendly design with modern tech aesthetics.',
    preview: '/templates/tech-course.jpg',
    features: [
      'Code syntax highlighting preview',
      'Tech-focused hero section',
      'Skills progression tracker',
      'Developer testimonials',
      'GitHub integration ready'
    ],
    colorScheme: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        content: {
          headline: 'Master Modern Web Development',
          subheadline: 'Build production-ready applications with React, Node.js, and cutting-edge technologies. Join 10,000+ developers who transformed their careers.',
          ctaText: 'Start Coding Today',
          backgroundImage: '',
          features: ['Live Coding Sessions', 'Real Projects', 'Career Support', 'Lifetime Access'],
          stats: {
            students: '10,000+',
            rating: '4.9/5',
            projects: '50+'
          }
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'What You\'ll Master',
        visible: true,
        order: 2,
        content: {
          title: 'Complete Full-Stack Development',
          subtitle: 'Everything you need to become a professional developer',
          features: [
            { 
              icon: '⚛️', 
              title: 'React & Next.js', 
              description: 'Build modern, responsive frontends with the latest React features and Next.js framework.'
            },
            { 
              icon: '🚀', 
              title: 'Node.js & APIs', 
              description: 'Create scalable backend services and RESTful APIs with Node.js and Express.'
            },
            { 
              icon: '💾', 
              title: 'Database Design', 
              description: 'Master PostgreSQL, MongoDB, and database optimization techniques.'
            },
            { 
              icon: '☁️', 
              title: 'Cloud Deployment', 
              description: 'Deploy applications to AWS, Vercel, and other cloud platforms.'
            },
            { 
              icon: '🔧', 
              title: 'DevOps Basics', 
              description: 'Learn Docker, CI/CD pipelines, and modern development workflows.'
            },
            { 
              icon: '📱', 
              title: 'Mobile Development', 
              description: 'Build mobile apps with React Native and responsive web design.'
            }
          ]
        }
      },
      {
        id: 'instructor',
        type: 'instructor',
        title: 'Meet Your Instructor',
        visible: true,
        order: 3,
        content: {
          name: 'Sarah Chen',
          title: 'Senior Full-Stack Engineer at Google',
          bio: '8+ years building scalable web applications. Former tech lead at startups and Fortune 500 companies. Passionate about teaching and mentoring new developers.',
          image: '/instructors/sarah-chen.jpg',
          credentials: [
            'Google Senior Software Engineer',
            'Former Netflix Tech Lead',
            'Computer Science, Stanford',
            '50,000+ students taught'
          ],
          socialLinks: {
            github: 'https://github.com/sarahchen',
            linkedin: 'https://linkedin.com/in/sarahchen',
            twitter: 'https://twitter.com/sarahchen'
          }
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Pricing',
        visible: true,
        order: 4,
        content: {
          title: 'Invest in Your Future',
          subtitle: 'One-time payment, lifetime access',
          price: '$299',
          originalPrice: '$599',
          discount: '50% OFF Early Bird',
          currency: 'USD',
          features: [
            '40+ hours of video content',
            '10 real-world projects',
            'Code reviews & feedback',
            'Private Discord community',
            'Career guidance & mentorship',
            'Lifetime updates',
            'Certificate of completion'
          ],
          guarantee: '30-day money-back guarantee',
          urgency: 'Early bird pricing ends in 48 hours!'
        }
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        title: 'Student Success Stories',
        visible: true,
        order: 5,
        content: {
          title: 'Join Thousands of Successful Developers',
          subtitle: 'Our students land jobs at top tech companies',
          testimonials: [
            {
              name: 'Alex Rodriguez',
              role: 'Software Engineer at Microsoft',
              company: 'Microsoft',
              rating: 5,
              text: 'This course changed my career completely. Within 6 months, I landed my dream job at Microsoft. The projects were incredibly practical and the instructor support was amazing.',
              image: '/testimonials/alex.jpg',
              before: 'Retail Manager',
              after: 'Software Engineer',
              salaryIncrease: '+150%'
            },
            {
              name: 'Maria Kim',
              role: 'Full-Stack Developer at Stripe',
              company: 'Stripe',
              rating: 5,
              text: 'The best investment I\'ve made in my career. The curriculum is up-to-date with industry standards and the real-world projects gave me confidence to apply for senior roles.',
              image: '/testimonials/maria.jpg',
              before: 'Marketing Specialist',
              after: 'Full-Stack Developer',
              salaryIncrease: '+200%'
            },
            {
              name: 'David Thompson',
              role: 'Tech Lead at Shopify',
              company: 'Shopify',
              rating: 5,
              text: 'Even as an experienced developer, this course taught me modern best practices and advanced patterns I use daily in my current role as a tech lead.',
              image: '/testimonials/david.jpg',
              before: 'Junior Developer',
              after: 'Tech Lead',
              salaryIncrease: '+120%'
            }
          ]
        }
      },
      {
        id: 'signup',
        type: 'signup',
        title: 'Start Your Journey',
        visible: true,
        order: 6,
        content: {
          title: 'Ready to Transform Your Career?',
          subtitle: 'Join thousands of developers who\'ve already made the leap',
          ctaText: 'Enroll Now',
          secondaryCtaText: 'Download Free Preview',
          formFields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
            { name: 'experience', label: 'Programming Experience', type: 'select', required: true, options: [
              'Complete Beginner',
              'Some Experience',
              'Intermediate',
              'Advanced'
            ]},
            { name: 'goals', label: 'Career Goals', type: 'textarea', required: false, placeholder: 'Tell us about your career goals...' }
          ],
          benefits: [
            'Instant access to all course materials',
            'Join our private Discord community',
            'Get personalized learning path',
            'Start with free bonus materials'
          ]
        }
      }
    ]
  },
  
  {
    id: 'business-bootcamp',
    name: 'Business Bootcamp',
    category: 'business',
    description: 'Ideal for business courses, management training, and professional development programs.',
    preview: '/templates/business-bootcamp.jpg',
    features: [
      'ROI-focused messaging',
      'Executive testimonials',
      'Corporate pricing tiers',
      'Professional design',
      'LinkedIn integration'
    ],
    colorScheme: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#f59e0b'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        content: {
          headline: 'Scale Your Business to 7 Figures',
          subheadline: 'Master the strategies used by Fortune 500 companies. Learn from executives who\'ve built billion-dollar businesses.',
          ctaText: 'Transform Your Business',
          backgroundImage: '',
          features: ['Proven Strategies', 'Expert Mentorship', 'Case Studies', 'Networking'],
          stats: {
            companies: '1,000+',
            revenue: '$10M+',
            growth: '300%'
          }
        }
      },
      {
        id: 'stats',
        type: 'stats',
        title: 'Proven Results',
        visible: true,
        order: 2,
        content: {
          title: 'Real Business Impact',
          subtitle: 'Our students achieve measurable results',
          stats: [
            { number: '89%', label: 'Revenue Growth', description: 'Average increase within 12 months' },
            { number: '156%', label: 'Profit Margin', description: 'Improvement in operational efficiency' },
            { number: '2,500+', label: 'Businesses', description: 'Successfully scaled using our methods' },
            { number: '95%', label: 'Success Rate', description: 'Students who implement our strategies' }
          ]
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'Business Transformation',
        visible: true,
        order: 3,
        content: {
          title: 'Complete Business Growth Framework',
          subtitle: 'Everything you need to scale your business systematically',
          features: [
            { 
              icon: '📈', 
              title: 'Growth Strategy', 
              description: 'Data-driven approaches to sustainable business growth and market expansion.'
            },
            { 
              icon: '💰', 
              title: 'Financial Mastery', 
              description: 'Advanced financial planning, cash flow management, and investment strategies.'
            },
            { 
              icon: '👥', 
              title: 'Team Leadership', 
              description: 'Build and lead high-performing teams that drive exceptional results.'
            },
            { 
              icon: '🎯', 
              title: 'Marketing Systems', 
              description: 'Create automated marketing funnels that generate consistent leads and sales.'
            }
          ]
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Investment Options',
        visible: true,
        order: 4,
        content: {
          title: 'Choose Your Growth Plan',
          subtitle: 'Flexible investment options for serious entrepreneurs',
          plans: [
            {
              name: 'Entrepreneur',
              price: '$997',
              originalPrice: '$1,997',
              popular: false,
              features: [
                'Complete video course (20+ hours)',
                'Business templates & tools',
                'Private mastermind group',
                '3 months of support'
              ]
            },
            {
              name: 'Business Owner',
              price: '$2,497',
              originalPrice: '$4,997',
              popular: true,
              features: [
                'Everything in Entrepreneur',
                '1-on-1 strategy sessions (3 calls)',
                'Custom business analysis',
                '6 months of support',
                'Direct access to instructor'
              ]
            },
            {
              name: 'Enterprise',
              price: '$9,997',
              originalPrice: '$19,997',
              popular: false,
              features: [
                'Everything in Business Owner',
                'Team training (up to 10 people)',
                'Quarterly strategy reviews',
                '12 months of support',
                'Custom implementation plan'
              ]
            }
          ],
          guarantee: '90-day results guarantee or full refund'
        }
      },
      {
        id: 'signup',
        type: 'signup',
        title: 'Get Started Today',
        visible: true,
        order: 5,
        content: {
          title: 'Ready to Scale Your Business?',
          subtitle: 'Schedule a free strategy call to discuss your business goals',
          ctaText: 'Book Strategy Call',
          formFields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Business Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { name: 'company', label: 'Company Name', type: 'text', required: true },
            { name: 'revenue', label: 'Annual Revenue', type: 'select', required: true, options: [
              'Under $100K',
              '$100K - $500K',
              '$500K - $1M',
              '$1M - $5M',
              'Over $5M'
            ]},
            { name: 'challenges', label: 'Biggest Business Challenge', type: 'textarea', required: true }
          ]
        }
      }
    ]
  },

  {
    id: 'creative-workshop',
    name: 'Creative Workshop',
    category: 'creative',
    description: 'Perfect for design courses, photography workshops, and creative skill development.',
    preview: '/templates/creative-workshop.jpg',
    features: [
      'Visual portfolio showcase',
      'Creative process breakdown',
      'Student work gallery',
      'Artistic design elements',
      'Instagram integration'
    ],
    colorScheme: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#f472b6'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        content: {
          headline: 'Unleash Your Creative Potential',
          subheadline: 'Master the art of visual storytelling with hands-on workshops led by award-winning designers.',
          ctaText: 'Start Creating',
          backgroundImage: '',
          features: ['Hands-on Learning', 'Portfolio Building', 'Industry Mentors', 'Creative Community']
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'Creative Skills',
        visible: true,
        order: 2,
        content: {
          title: 'Master Every Creative Tool',
          features: [
            { icon: '🎨', title: 'Design Fundamentals', description: 'Color theory, composition, and visual hierarchy' },
            { icon: '📷', title: 'Photography', description: 'Lighting, composition, and post-processing techniques' },
            { icon: '✏️', title: 'Illustration', description: 'Digital and traditional illustration methods' },
            { icon: '🎬', title: 'Video Production', description: 'Filming, editing, and storytelling for video' }
          ]
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Workshop Pricing',
        visible: true,
        order: 3,
        content: {
          title: 'Join the Creative Community',
          price: '$197',
          originalPrice: '$397',
          features: ['6-week intensive workshop', 'Personal portfolio review', 'Creative community access', 'Bonus design resources'],
          guarantee: '14-day creative satisfaction guarantee'
        }
      },
      {
        id: 'signup',
        type: 'signup',
        title: 'Enrollment',
        visible: true,
        order: 4,
        content: {
          title: 'Ready to Create Something Amazing?',
          subtitle: 'Join our next creative workshop cohort',
          ctaText: 'Enroll in Workshop',
          formFields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'portfolio', label: 'Portfolio URL (optional)', type: 'url', required: false },
            { name: 'experience', label: 'Creative Experience', type: 'select', required: true, options: [
              'Complete Beginner',
              'Hobbyist',
              'Some Professional Experience',
              'Professional'
            ]}
          ]
        }
      }
    ]
  },

  {
    id: 'certification-program',
    name: 'Professional Certification',
    category: 'certification',
    description: 'Designed for professional certification programs and accredited courses.',
    preview: '/templates/certification.jpg',
    features: [
      'Credential-focused design',
      'Accreditation highlights',
      'Career advancement focus',
      'Professional testimonials',
      'Industry recognition'
    ],
    colorScheme: {
      primary: '#059669',
      secondary: '#065f46',
      accent: '#10b981'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        content: {
          headline: 'Get Certified. Get Ahead.',
          subheadline: 'Earn industry-recognized credentials that accelerate your career and increase your earning potential.',
          ctaText: 'Start Certification',
          features: ['Accredited Program', 'Industry Recognition', 'Career Support', 'Lifetime Certification']
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'Certification Benefits',
        visible: true,
        order: 2,
        content: {
          title: 'Why Get Certified?',
          features: [
            { icon: '🏆', title: 'Industry Recognition', description: 'Globally recognized certification by leading industry bodies' },
            { icon: '💼', title: 'Career Advancement', description: 'Average 40% salary increase after certification' },
            { icon: '📋', title: 'Structured Learning', description: 'Comprehensive curriculum designed by experts' },
            { icon: '🤝', title: 'Professional Network', description: 'Connect with certified professionals worldwide' }
          ]
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Certification Investment',
        visible: true,
        order: 3,
        content: {
          title: 'Professional Certification Program',
          price: '$1,299',
          originalPrice: '$1,999',
          features: [
            'Complete certification curriculum',
            'Practice exams and assessments',
            'Official certification upon completion',
            'Career services and job placement',
            '1 year of continuing education'
          ],
          guarantee: 'Pass guarantee or retake for free'
        }
      },
      {
        id: 'signup',
        type: 'signup',
        title: 'Begin Certification',
        visible: true,
        order: 4,
        content: {
          title: 'Ready to Get Certified?',
          subtitle: 'Start your professional certification journey today',
          ctaText: 'Begin Certification Process',
          formFields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', required: true },
            { name: 'email', label: 'Professional Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { name: 'currentRole', label: 'Current Job Title', type: 'text', required: true },
            { name: 'company', label: 'Company', type: 'text', required: false },
            { name: 'experience', label: 'Years of Experience', type: 'select', required: true, options: [
              '0-2 years',
              '3-5 years',
              '6-10 years',
              '10+ years'
            ]}
          ]
        }
      }
    ]
  },

  {
    id: 'minimal-launch',
    name: 'Quick Launch',
    category: 'minimal',
    description: 'Clean, minimal design perfect for rapid course launches and simple offerings.',
    preview: '/templates/minimal.jpg',
    features: [
      'Ultra-fast loading',
      'Mobile-first design',
      'Single call-to-action',
      'Distraction-free layout',
      'High conversion focus'
    ],
    colorScheme: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8'
    },
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Hero Section',
        visible: true,
        order: 1,
        content: {
          headline: 'Learn. Grow. Succeed.',
          subheadline: 'A focused course designed to get you results fast. No fluff, just actionable strategies.',
          ctaText: 'Get Started Now',
          features: ['Results-Focused', 'Easy to Follow', 'Immediate Access']
        }
      },
      {
        id: 'features',
        type: 'features',
        title: 'What You Get',
        visible: true,
        order: 2,
        content: {
          title: 'Everything You Need',
          features: [
            { icon: '⚡', title: 'Quick Results', description: 'See progress in your first week' },
            { icon: '📱', title: 'Mobile Friendly', description: 'Learn anywhere, anytime' },
            { icon: '🎯', title: 'Focused Content', description: 'No unnecessary complexity' }
          ]
        }
      },
      {
        id: 'pricing',
        type: 'pricing',
        title: 'Simple Pricing',
        visible: true,
        order: 3,
        content: {
          title: 'One Price, Everything Included',
          price: '$97',
          features: ['Complete course access', 'Mobile app included', 'Email support'],
          guarantee: 'Money-back guarantee'
        }
      },
      {
        id: 'signup',
        type: 'signup',
        title: 'Get Started',
        visible: true,
        order: 4,
        content: {
          title: 'Ready to Begin?',
          subtitle: 'Join thousands of successful students',
          ctaText: 'Start Learning Today',
          formFields: [
            { name: 'firstName', label: 'First Name', type: 'text', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: true }
          ]
        }
      }
    ]
  }
];