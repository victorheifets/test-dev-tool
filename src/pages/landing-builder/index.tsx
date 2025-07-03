import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Avatar,
  Rating,
} from '@mui/material';
import {
  DragIndicator,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Publish as PublishIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'signup' | 'faq';
  title: string;
  content: any;
  visible: boolean;
}

interface LandingPageData {
  id?: string;
  course_id: string;
  title: string;
  slug: string;
  meta_description: string;
  sections: LandingPageSection[];
  theme: 'light' | 'dark' | 'colorful';
  published: boolean;
}

const defaultSections: LandingPageSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    visible: true,
    content: {
      headline: 'Transform Your Career Today',
      subheadline: 'Join thousands of students who have advanced their careers with our expert-led course',
      ctaText: 'Enroll Now',
      backgroundImage: '',
      features: ['Expert Instructors', 'Lifetime Access', 'Certificate of Completion']
    }
  },
  {
    id: 'features',
    type: 'features',
    title: 'Course Features',
    visible: true,
    content: {
      title: 'What You\'ll Learn',
      features: [
        { icon: '📚', title: 'Comprehensive Curriculum', description: 'Complete coverage of all essential topics' },
        { icon: '🎯', title: 'Practical Projects', description: 'Real-world projects to build your portfolio' },
        { icon: '👨‍🏫', title: 'Expert Support', description: 'Get help from industry professionals' }
      ]
    }
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    title: 'Student Testimonials',
    visible: true,
    content: {
      title: 'What Our Students Say',
      testimonials: [
        { name: 'Sarah Johnson', role: 'Software Engineer', rating: 5, text: 'This course changed my career completely!' },
        { name: 'Mike Chen', role: 'Product Manager', rating: 5, text: 'Excellent content and amazing support.' }
      ]
    }
  },
  {
    id: 'pricing',
    type: 'pricing',
    title: 'Pricing',
    visible: true,
    content: {
      title: 'Choose Your Plan',
      price: '$199',
      originalPrice: '$299',
      features: ['Lifetime Access', 'All Course Materials', 'Certificate', 'Community Access'],
      guarantee: '30-day money-back guarantee'
    }
  },
  {
    id: 'signup',
    type: 'signup',
    title: 'Enrollment Form',
    visible: true,
    content: {
      title: 'Start Your Journey Today',
      subtitle: 'Join the course and transform your career',
      fields: ['name', 'email', 'phone']
    }
  }
];

export const LandingPageBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [landingPage, setLandingPage] = useState<LandingPageData>({
    course_id: '',
    title: 'My Course Landing Page',
    slug: 'my-course',
    meta_description: 'Learn valuable skills with our comprehensive course',
    sections: defaultSections,
    theme: 'light',
    published: false
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleSectionReorder = useCallback((result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(landingPage.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLandingPage(prev => ({ ...prev, sections: items }));
  }, [landingPage.sections]);

  const updateSection = (sectionId: string, updates: Partial<LandingPageSection>) => {
    setLandingPage(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const removeSection = (sectionId: string) => {
    setLandingPage(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const SectionEditor: React.FC<{ section: LandingPageSection }> = ({ section }) => {
    const updateSectionContent = (updates: any) => {
      updateSection(section.id, {
        content: { ...section.content, ...updates }
      });
    };

    switch (section.type) {
      case 'hero':
        return (
          <Stack spacing={2}>
            <TextField
              label="Headline"
              fullWidth
              value={section.content.headline || ''}
              onChange={(e) => updateSectionContent({ headline: e.target.value })}
            />
            <TextField
              label="Subheadline"
              fullWidth
              multiline
              rows={2}
              value={section.content.subheadline || ''}
              onChange={(e) => updateSectionContent({ subheadline: e.target.value })}
            />
            <TextField
              label="CTA Button Text"
              value={section.content.ctaText || ''}
              onChange={(e) => updateSectionContent({ ctaText: e.target.value })}
            />
            <TextField
              label="Key Features (comma separated)"
              fullWidth
              value={section.content.features?.join(', ') || ''}
              onChange={(e) => updateSectionContent({ 
                features: e.target.value.split(',').map((f: string) => f.trim())
              })}
            />
          </Stack>
        );

      case 'pricing':
        return (
          <Stack spacing={2}>
            <TextField
              label="Section Title"
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent({ title: e.target.value })}
            />
            <TextField
              label="Price"
              value={section.content.price || ''}
              onChange={(e) => updateSectionContent({ price: e.target.value })}
            />
            <TextField
              label="Original Price (optional)"
              value={section.content.originalPrice || ''}
              onChange={(e) => updateSectionContent({ originalPrice: e.target.value })}
            />
            <TextField
              label="Features (comma separated)"
              fullWidth
              multiline
              value={section.content.features?.join(', ') || ''}
              onChange={(e) => updateSectionContent({ 
                features: e.target.value.split(',').map((f: string) => f.trim())
              })}
            />
          </Stack>
        );

      case 'signup':
        return (
          <Stack spacing={2}>
            <TextField
              label="Form Title"
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent({ title: e.target.value })}
            />
            <TextField
              label="Subtitle"
              value={section.content.subtitle || ''}
              onChange={(e) => updateSectionContent({ subtitle: e.target.value })}
            />
          </Stack>
        );

      default:
        return (
          <TextField
            label="Section Title"
            value={section.title || ''}
            onChange={(e) => updateSection(section.id, { title: e.target.value })}
          />
        );
    }
  };

  const SectionPreview: React.FC<{ section: LandingPageSection }> = ({ section }) => {
    if (!section.visible) return null;

    switch (section.type) {
      case 'hero':
        return (
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 6,
            textAlign: 'center'
          }}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {section.content.headline}
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              {section.content.subheadline}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              {section.content.features?.map((feature: string, index: number) => (
                <Chip key={index} label={feature} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              ))}
            </Stack>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                bgcolor: '#ff6b6b', 
                px: 4, 
                py: 1.5,
                '&:hover': { bgcolor: '#ff5252' }
              }}
            >
              {section.content.ctaText}
            </Button>
          </Box>
        );

      case 'features':
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {section.content.title}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {section.content.features?.map((feature: any, index: number) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>{feature.icon}</Typography>
                    <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'testimonials':
        return (
          <Box sx={{ p: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h4" align="center" gutterBottom>
              {section.content.title}
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {section.content.testimonials?.map((testimonial: any, index: number) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar><PersonIcon /></Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'pricing':
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {section.content.title}
            </Typography>
            <Card sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    {section.content.price}
                  </Typography>
                  {section.content.originalPrice && (
                    <Typography 
                      variant="h6" 
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      {section.content.originalPrice}
                    </Typography>
                  )}
                </Box>
                <Divider />
                <Stack spacing={1}>
                  {section.content.features?.map((feature: string, index: number) => (
                    <Typography key={index} variant="body1">
                      ✓ {feature}
                    </Typography>
                  ))}
                </Stack>
                <Button variant="contained" size="large" sx={{ mt: 2 }}>
                  Enroll Now
                </Button>
                {section.content.guarantee && (
                  <Typography variant="body2" color="text.secondary">
                    {section.content.guarantee}
                  </Typography>
                )}
              </Stack>
            </Card>
          </Box>
        );

      case 'signup':
        return (
          <Box sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
            <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                {section.content.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                {section.content.subtitle}
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <TextField label="Full Name" fullWidth />
                  <TextField label="Email Address" type="email" fullWidth />
                  <TextField label="Phone Number" fullWidth />
                  <Button variant="contained" size="large" fullWidth>
                    Start Learning Today
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (previewMode) {
    return (
      <Box>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, bgcolor: 'background.paper', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              startIcon={<EditIcon />}
              onClick={() => setPreviewMode(false)}
              variant="outlined"
            >
              Back to Editor
            </Button>
            <Typography variant="h6">{landingPage.title} - Preview</Typography>
          </Stack>
        </Box>
        <Box>
          {landingPage.sections.map((section) => (
            <SectionPreview key={section.id} section={section} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Landing Page Builder
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewMode(true)}
              variant="outlined"
            >
              Preview
            </Button>
            <Button
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialogOpen(true)}
              variant="contained"
            >
              Save
            </Button>
          </Stack>
        </Stack>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Settings" />
          <Tab label="Sections" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  label="Page Title"
                  fullWidth
                  value={landingPage.title}
                  onChange={(e) => setLandingPage(prev => ({ ...prev, title: e.target.value }))}
                />
                <TextField
                  label="URL Slug"
                  fullWidth
                  value={landingPage.slug}
                  onChange={(e) => setLandingPage(prev => ({ ...prev, slug: e.target.value }))}
                  helperText="This will be the URL: /landing/your-slug"
                />
                <TextField
                  label="Meta Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={landingPage.meta_description}
                  onChange={(e) => setLandingPage(prev => ({ ...prev, meta_description: e.target.value }))}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={landingPage.published}
                      onChange={(e) => setLandingPage(prev => ({ ...prev, published: e.target.checked }))}
                    />
                  }
                  label="Published"
                />
              </Stack>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <DragDropContext onDragEnd={handleSectionReorder}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {landingPage.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Accordion sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                                <div {...provided.dragHandleProps}>
                                  <DragIndicator sx={{ color: 'grey.500' }} />
                                </div>
                                <Typography variant="h6">{section.title}</Typography>
                                <Chip 
                                  label={section.type} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                                <Box sx={{ flexGrow: 1 }} />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={section.visible}
                                      onChange={(e) => updateSection(section.id, { visible: e.target.checked })}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  }
                                  label="Visible"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSection(section.id);
                                  }}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <SectionEditor section={section} />
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            💡 <strong>Pro Tip:</strong> You can drag sections to reorder them, toggle visibility, and customize content for each section. 
            Use the preview mode to see how your landing page will look to visitors.
          </Typography>
        </Alert>
      </Paper>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Landing Page</DialogTitle>
        <DialogContent>
          <Typography>
            Your landing page will be saved and {landingPage.published ? 'published' : 'kept as draft'}.
            {landingPage.published && (
              <>
                <br />
                <br />
                <strong>Live URL:</strong> /landing/{landingPage.slug}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSaveDialogOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};