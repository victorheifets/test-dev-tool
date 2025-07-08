import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  Visibility as PreviewIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { TemplateGallery } from './TemplateGallery';
import { TemplateEditor } from './TemplateEditor';
import { PreviewMode } from './PreviewMode';
import { Template, LandingPageData } from './types';

const steps = [
  'Choose Template',
  'Customize Content', 
  'Preview & Publish'
];

export const LandingPageBuilderV2: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setLandingPageData({
      id: undefined,
      course_id: '',
      title: template.name,
      slug: template.name.toLowerCase().replace(/\s+/g, '-'),
      meta_description: `${template.name} - Transform your career with our comprehensive course`,
      template_id: template.id,
      sections: template.sections,
      customizations: {},
      published: false,
    });
    setActiveStep(1);
  };

  const handleCustomizationUpdate = (updates: Partial<LandingPageData>) => {
    if (landingPageData) {
      setLandingPageData({ ...landingPageData, ...updates });
    }
  };

  const handleNext = () => {
    if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(0);
      setSelectedTemplate(null);
      setLandingPageData(null);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handlePublish = () => {
    if (landingPageData) {
      // TODO: Implement save/publish functionality
      console.log('Publishing landing page:', landingPageData);
      alert('Landing page published successfully! (Backend integration needed)');
    }
  };

  if (previewMode && landingPageData) {
    return (
      <PreviewMode
        landingPageData={landingPageData}
        onBack={() => setPreviewMode(false)}
        onPublish={handlePublish}
      />
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ p: 4, minHeight: '80vh' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Landing Page Builder
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create professional course landing pages in minutes
            </Typography>
          </Box>
          
          {landingPageData && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={handlePreview}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={handlePublish}
                color="success"
              >
                Publish
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Fade in={true} timeout={500}>
          <Box>
            {activeStep === 0 && (
              <TemplateGallery onTemplateSelect={handleTemplateSelect} />
            )}

            {activeStep === 1 && selectedTemplate && landingPageData && (
              <>
                <TemplateEditor
                  template={selectedTemplate}
                  landingPageData={landingPageData}
                  onUpdate={handleCustomizationUpdate}
                />
                
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                  <Button
                    startIcon={<BackIcon />}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back to Templates
                  </Button>
                  <Button
                    endIcon={<NextIcon />}
                    onClick={handleNext}
                    variant="contained"
                  >
                    Continue to Preview
                  </Button>
                </Stack>
              </>
            )}

            {activeStep === 2 && landingPageData && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Ready to Publish
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your landing page is ready! Preview it one more time or publish it live.
                </Typography>
                
                <Stack direction="row" spacing={2}>
                  <Button
                    startIcon={<BackIcon />}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back to Edit
                  </Button>
                  <Button
                    startIcon={<PreviewIcon />}
                    onClick={handlePreview}
                    variant="outlined"
                  >
                    Final Preview
                  </Button>
                  <Button
                    startIcon={<PublishIcon />}
                    onClick={handlePublish}
                    variant="contained"
                    color="success"
                    size="large"
                  >
                    Publish Landing Page
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Fade>
      </Paper>
    </Container>
  );
};