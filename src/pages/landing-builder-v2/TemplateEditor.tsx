import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Stack,
  Chip,
  Divider,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { Template, LandingPageData, LandingPageSection } from './types';

interface TemplateEditorProps {
  template: Template;
  landingPageData: LandingPageData;
  onUpdate: (updates: Partial<LandingPageData>) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  landingPageData,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string>('hero');

  const updateSection = (sectionId: string, updates: Partial<LandingPageSection>) => {
    const updatedSections = landingPageData.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    onUpdate({ sections: updatedSections });
  };

  const updateSectionContent = (sectionId: string, contentUpdates: any) => {
    const section = landingPageData.sections.find(s => s.id === sectionId);
    if (section) {
      const updatedContent = { ...section.content, ...contentUpdates };
      updateSection(sectionId, { content: updatedContent });
    }
  };

  const SectionEditor: React.FC<{ section: LandingPageSection }> = ({ section }) => {
    switch (section.type) {
      case 'hero':
        return (
          <Stack spacing={3}>
            <TextField
              label="Main Headline"
              fullWidth
              value={section.content.headline || ''}
              onChange={(e) => updateSectionContent(section.id, { headline: e.target.value })}
              helperText="Your main value proposition - keep it clear and compelling"
            />
            <TextField
              label="Subheadline"
              fullWidth
              multiline
              rows={3}
              value={section.content.subheadline || ''}
              onChange={(e) => updateSectionContent(section.id, { subheadline: e.target.value })}
              helperText="Expand on your headline with benefits and social proof"
            />
            <TextField
              label="Call-to-Action Button Text"
              value={section.content.ctaText || ''}
              onChange={(e) => updateSectionContent(section.id, { ctaText: e.target.value })}
              helperText="Action-oriented text like 'Get Started', 'Enroll Now', etc."
            />
            <TextField
              label="Key Features (comma separated)"
              fullWidth
              value={section.content.features?.join(', ') || ''}
              onChange={(e) => updateSectionContent(section.id, { 
                features: e.target.value.split(',').map((f: string) => f.trim()).filter(Boolean)
              })}
              helperText="Highlight 3-4 key benefits or features"
            />
            {section.content.stats && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Statistics (optional)
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(section.content.stats).map(([key, value]) => (
                      <Grid item xs={12} sm={4} key={key}>
                        <TextField
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          fullWidth
                          value={value || ''}
                          onChange={(e) => updateSectionContent(section.id, { 
                            stats: { ...section.content.stats, [key]: e.target.value }
                          })}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Stack>
        );

      case 'features':
        return (
          <Stack spacing={3}>
            <TextField
              label="Section Title"
              fullWidth
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
            />
            <TextField
              label="Subtitle (optional)"
              fullWidth
              value={section.content.subtitle || ''}
              onChange={(e) => updateSectionContent(section.id, { subtitle: e.target.value })}
            />
            <Typography variant="subtitle1">Features</Typography>
            {section.content.features?.map((feature: any, index: number) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Icon/Emoji"
                        value={feature.icon || ''}
                        onChange={(e) => {
                          const updatedFeatures = [...section.content.features];
                          updatedFeatures[index] = { ...feature, icon: e.target.value };
                          updateSectionContent(section.id, { features: updatedFeatures });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Feature Title"
                        fullWidth
                        value={feature.title || ''}
                        onChange={(e) => {
                          const updatedFeatures = [...section.content.features];
                          updatedFeatures[index] = { ...feature, title: e.target.value };
                          updateSectionContent(section.id, { features: updatedFeatures });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={2}
                        value={feature.description || ''}
                        onChange={(e) => {
                          const updatedFeatures = [...section.content.features];
                          updatedFeatures[index] = { ...feature, description: e.target.value };
                          updateSectionContent(section.id, { features: updatedFeatures });
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        );

      case 'pricing':
        return (
          <Stack spacing={3}>
            <TextField
              label="Section Title"
              fullWidth
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
            />
            <TextField
              label="Subtitle (optional)"
              fullWidth
              value={section.content.subtitle || ''}
              onChange={(e) => updateSectionContent(section.id, { subtitle: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  fullWidth
                  value={section.content.price || ''}
                  onChange={(e) => updateSectionContent(section.id, { price: e.target.value })}
                  placeholder="$299"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Original Price (optional)"
                  fullWidth
                  value={section.content.originalPrice || ''}
                  onChange={(e) => updateSectionContent(section.id, { originalPrice: e.target.value })}
                  placeholder="$599"
                />
              </Grid>
            </Grid>
            <TextField
              label="Features Included (one per line)"
              fullWidth
              multiline
              rows={6}
              value={section.content.features?.join('\n') || ''}
              onChange={(e) => updateSectionContent(section.id, { 
                features: e.target.value.split('\n').filter(Boolean)
              })}
              placeholder="Lifetime access&#10;All course materials&#10;Certificate of completion"
            />
            <TextField
              label="Money-back Guarantee"
              fullWidth
              value={section.content.guarantee || ''}
              onChange={(e) => updateSectionContent(section.id, { guarantee: e.target.value })}
              placeholder="30-day money-back guarantee"
            />
            {section.content.urgency !== undefined && (
              <TextField
                label="Urgency Message (optional)"
                fullWidth
                value={section.content.urgency || ''}
                onChange={(e) => updateSectionContent(section.id, { urgency: e.target.value })}
                placeholder="Limited time offer!"
              />
            )}
          </Stack>
        );

      case 'signup':
        return (
          <Stack spacing={3}>
            <TextField
              label="Form Title"
              fullWidth
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
            />
            <TextField
              label="Subtitle"
              fullWidth
              value={section.content.subtitle || ''}
              onChange={(e) => updateSectionContent(section.id, { subtitle: e.target.value })}
            />
            <TextField
              label="Submit Button Text"
              value={section.content.ctaText || ''}
              onChange={(e) => updateSectionContent(section.id, { ctaText: e.target.value })}
            />
            <Alert severity="info">
              <Typography variant="body2">
                Form fields are pre-configured based on your template. The form will integrate with your lead API to capture submissions.
              </Typography>
            </Alert>
          </Stack>
        );

      case 'testimonials':
        return (
          <Stack spacing={3}>
            <TextField
              label="Section Title"
              fullWidth
              value={section.content.title || ''}
              onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
            />
            <TextField
              label="Subtitle (optional)"
              fullWidth
              value={section.content.subtitle || ''}
              onChange={(e) => updateSectionContent(section.id, { subtitle: e.target.value })}
            />
            <Typography variant="subtitle1">Testimonials</Typography>
            {section.content.testimonials?.slice(0, 3).map((testimonial: any, index: number) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Customer Name"
                        fullWidth
                        value={testimonial.name || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...section.content.testimonials];
                          updatedTestimonials[index] = { ...testimonial, name: e.target.value };
                          updateSectionContent(section.id, { testimonials: updatedTestimonials });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Role/Title"
                        fullWidth
                        value={testimonial.role || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...section.content.testimonials];
                          updatedTestimonials[index] = { ...testimonial, role: e.target.value };
                          updateSectionContent(section.id, { testimonials: updatedTestimonials });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Testimonial Text"
                        fullWidth
                        multiline
                        rows={3}
                        value={testimonial.text || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...section.content.testimonials];
                          updatedTestimonials[index] = { ...testimonial, text: e.target.value };
                          updateSectionContent(section.id, { testimonials: updatedTestimonials });
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        );

      default:
        return (
          <Typography color="text.secondary">
            Section editor for {section.type} is not implemented yet.
          </Typography>
        );
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Chip 
            label={template.name} 
            color="primary" 
            icon={<PaletteIcon />}
          />
          <Typography variant="h6">
            Customize Your Landing Page
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Personalize your landing page content. All changes are automatically saved as you type.
        </Typography>
      </Paper>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Page Settings" icon={<SettingsIcon />} iconPosition="start" />
        <Tab label="Content Sections" icon={<EditIcon />} iconPosition="start" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Page Settings
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Page Title"
              fullWidth
              value={landingPageData.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              helperText="This will appear in browser tabs and search results"
            />
            <TextField
              label="URL Slug"
              fullWidth
              value={landingPageData.slug}
              onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              helperText={`Your page will be available at: /landing/${landingPageData.slug}`}
            />
            <TextField
              label="Meta Description"
              fullWidth
              multiline
              rows={3}
              value={landingPageData.meta_description}
              onChange={(e) => onUpdate({ meta_description: e.target.value })}
              helperText="Brief description for search engines (150-160 characters recommended)"
              inputProps={{ maxLength: 160 }}
            />
          </Stack>
        </Paper>
      )}

      {activeTab === 1 && (
        <Stack spacing={2}>
          {landingPageData.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <Accordion
                key={section.id}
                expanded={expandedSection === section.id}
                onChange={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                    <Typography variant="h6">{section.title}</Typography>
                    <Chip 
                      label={section.type.charAt(0).toUpperCase() + section.type.slice(1)} 
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
                      label=""
                      onClick={(e) => e.stopPropagation()}
                    />
                    <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                      {section.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <SectionEditor section={section} />
                </AccordionDetails>
              </Accordion>
            ))}
        </Stack>
      )}

      <Alert severity="success" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Auto-save enabled:</strong> All your changes are automatically saved. 
          Use the preview button to see how your landing page looks to visitors.
        </Typography>
      </Alert>
    </Box>
  );
};