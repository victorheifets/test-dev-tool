import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Alert,
  Fade,
  useTheme,
  alpha,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Visibility,
  Publish,
  CheckCircle,
} from '@mui/icons-material';
import TemplateSelector from './TemplateSelector';
import ContentEditor from './ContentEditor';
import LivePreview from './LivePreview';
import { LANDING_TEMPLATES, DEFAULT_CONTENT } from '../../lib/landing/templates';
import type { 
  LandingPageData, 
  LandingPageContent,
} from '../../types/landing';
import { LandingPageStatus, FormFieldType } from '../../types/landing';

const EDITOR_STEPS = [
  { label: 'Choose Template', description: 'Select a professional template' },
  { label: 'Edit Content', description: 'Customize your content' },
  { label: 'Configure Form', description: 'Set up lead capture' },
  { label: 'Preview & Publish', description: 'Review and publish' },
];

const CONTENT_SECTIONS = [
  { key: 'hero', label: 'Hero Section', icon: '🚀' },
  { key: 'features', label: 'Course Features', icon: '⭐' },
  { key: 'instructor', label: 'About Instructor', icon: '👨‍🏫' },
  { key: 'pricing', label: 'Pricing & Enrollment', icon: '💰' },
] as const;

export default function LandingEditor() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [contentTab, setContentTab] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    id: `landing-${Date.now()}`,
    title: 'My Course Landing Page',
    slug: 'my-course',
    courseId: undefined,
    template: selectedTemplate,
    status: LandingPageStatus.DRAFT,
    content: {
      hero: DEFAULT_CONTENT.hero,
      features: {
        title: DEFAULT_CONTENT.features.title,
        subtitle: DEFAULT_CONTENT.features.subtitle,
        items: DEFAULT_CONTENT.features.items.map((item, index) => ({
          id: `feature-${index}`,
          title: item.title,
          description: item.description,
          order: index,
        })),
        layout: 'grid' as const,
      },
      instructor: DEFAULT_CONTENT.instructor,
      testimonials: {
        title: 'What Students Say',
        subtitle: 'Join thousands of successful graduates',
        testimonials: [],
        layout: 'carousel' as const,
      },
      pricing: DEFAULT_CONTENT.pricing,
      contact: {
        title: 'Get in Touch',
        subtitle: 'Questions? We\'re here to help',
        phone: '+1 (555) 123-4567',
        email: 'hello@courseplatform.com',
      },
    },
    settings: {
      template: selectedTemplate,
      colors: LANDING_TEMPLATES[selectedTemplate].colors,
      fonts: LANDING_TEMPLATES[selectedTemplate].fonts,
      spacing: LANDING_TEMPLATES[selectedTemplate].spacing,
      borderRadius: LANDING_TEMPLATES[selectedTemplate].borderRadius,
      enabledSections: ['hero', 'features', 'instructor', 'pricing', 'contact'],
      sectionOrder: ['hero', 'features', 'instructor', 'pricing', 'contact'],
    },
    formConfig: {
      fields: [
        { id: 'firstName', name: 'firstName', label: 'First Name', type: FormFieldType.TEXT, required: true, order: 0, enabled: true },
        { id: 'lastName', name: 'lastName', label: 'Last Name', type: FormFieldType.TEXT, required: true, order: 1, enabled: true },
        { id: 'email', name: 'email', label: 'Email Address', type: FormFieldType.EMAIL, required: true, order: 2, enabled: true },
        { id: 'phone', name: 'phone', label: 'Phone Number', type: FormFieldType.TEL, required: false, order: 3, enabled: true },
      ],
      submitText: 'Enroll Now',
      successMessage: 'Thank you! We\'ll contact you soon.',
      errorMessage: 'Something went wrong. Please try again.',
      emailNotifications: true,
      autoResponder: true,
    },
    analytics: {
      views: { total: 0, today: 0, thisWeek: 0, thisMonth: 0, previousMonth: 0, changePercent: 0 },
      leads: { total: 0, today: 0, thisWeek: 0, thisMonth: 0, previousMonth: 0, changePercent: 0 },
      conversions: { total: 0, today: 0, thisWeek: 0, thisMonth: 0, previousMonth: 0, changePercent: 0 },
      bounceRate: 0,
      averageTimeOnPage: 0,
      topTrafficSources: [],
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      lastUpdated: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (selectedTemplate !== landingPageData.template) {
      const template = LANDING_TEMPLATES[selectedTemplate];
      setLandingPageData(prev => ({
        ...prev,
        template: selectedTemplate,
        settings: {
          ...prev.settings,
          template: selectedTemplate,
          colors: template.colors,
          fonts: template.fonts,
          spacing: template.spacing,
          borderRadius: template.borderRadius,
        },
      }));
    }
  }, [selectedTemplate, landingPageData.template]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (activeStep === 0) {
      setActiveStep(1);
    }
  };

  const handleContentChange = (content: LandingPageContent) => {
    setLandingPageData(prev => ({
      ...prev,
      content,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving landing page:', landingPageData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const currentTemplate = LANDING_TEMPLATES[selectedTemplate];

  if (isPreviewMode) {
    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Live Preview</Typography>
            <Button variant="outlined" onClick={() => setIsPreviewMode(false)}>
              Back to Editor
            </Button>
          </Box>
        </Paper>
        <LivePreview
          data={landingPageData}
          template={currentTemplate}
          isPublic={false}
          showControls={true}
          onEdit={() => setIsPreviewMode(false)}
        />
      </Box>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
            templates={[]}
            showPreview={true}
          />
        );

      case 1:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, borderRadius: 2, height: 'fit-content', position: 'sticky', top: 20 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Content Sections
                </Typography>
                <Stack spacing={1}>
                  {CONTENT_SECTIONS.map((section, index) => (
                    <Button
                      key={section.key}
                      variant={contentTab === index ? 'contained' : 'outlined'}
                      onClick={() => setContentTab(index)}
                      startIcon={<span>{section.icon}</span>}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2, textTransform: 'none', py: 1.5 }}
                    >
                      {section.label}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Paper sx={{ p: 4, borderRadius: 3, minHeight: 600 }}>
                <ContentEditor
                  content={landingPageData.content}
                  template={currentTemplate}
                  onChange={handleContentChange}
                  section={CONTENT_SECTIONS[contentTab].key}
                  readonly={false}
                />
              </Paper>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Form Configuration
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Using default form with first name, last name, email, and phone fields.
              All leads will be sent to your existing API.
            </Typography>
            <Alert severity="info">
              Form integration ready - leads will be sent to <code>/api/marketing/leads</code>
            </Alert>
          </Paper>
        );

      case 3:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  Preview Your Landing Page
                </Typography>
                <Box
                  sx={{
                    border: `2px solid ${alpha(currentTemplate.colors.primary, 0.2)}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxHeight: 600,
                    overflowY: 'auto',
                  }}
                >
                  <LivePreview
                    data={landingPageData}
                    template={currentTemplate}
                    isPublic={true}
                    showControls={false}
                  />
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Publish Settings
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Landing Page URL
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        /landing/{landingPageData.slug}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Publish />}
                      onClick={handleSave}
                      sx={{ py: 2, borderRadius: 2 }}
                    >
                      Publish Landing Page
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Landing Page Builder V3
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create professional landing pages with TipTap editor
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            {saveStatus !== 'idle' && (
              <Alert severity={saveStatus === 'saved' ? 'success' : saveStatus === 'error' ? 'error' : 'info'} sx={{ py: 0 }}>
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && 'Saved!'}
                {saveStatus === 'error' && 'Error'}
              </Alert>
            )}
            
            <Button variant="outlined" startIcon={<Visibility />} onClick={() => setIsPreviewMode(!isPreviewMode)}>
              Preview
            </Button>
            
            <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Box>
        
        <Stepper activeStep={activeStep}>
          {EDITOR_STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      {/* Content */}
      <Box sx={{ mb: 4 }}>
        {renderStepContent()}
      </Box>
      
      {/* Navigation */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {EDITOR_STEPS.length}
          </Typography>
          
          <Button
            variant="contained"
            endIcon={activeStep === EDITOR_STEPS.length - 1 ? <CheckCircle /> : <ArrowForward />}
            onClick={() => setActiveStep(Math.min(EDITOR_STEPS.length - 1, activeStep + 1))}
          >
            {activeStep === EDITOR_STEPS.length - 1 ? 'Publish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}