import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
  Badge,
  CardActions,
} from '@mui/material';
import {
  Code as TechIcon,
  Business as BusinessIcon,
  Palette as CreativeIcon,
  School as CertificationIcon,
  Speed as MinimalIcon,
  Star as FeaturedIcon,
} from '@mui/icons-material';
import { Template } from './types';
import { templateLibrary } from './templates/templateLibrary';

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

const categoryIcons = {
  tech: <TechIcon />,
  business: <BusinessIcon />,
  creative: <CreativeIcon />,
  certification: <CertificationIcon />,
  minimal: <MinimalIcon />,
};

const categoryLabels = {
  tech: 'Technology',
  business: 'Business',
  creative: 'Creative',
  certification: 'Certification',
  minimal: 'Minimal',
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templateLibrary 
    : templateLibrary.filter(template => template.category === selectedCategory);

  const categories = ['all', ...Object.keys(categoryLabels)];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Choose Your Landing Page Template
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select from our professionally designed templates. Each template is optimized for conversions and mobile-friendly.
      </Typography>

      {/* Category Filter */}
      <Tabs 
        value={selectedCategory} 
        onChange={(e, value) => setSelectedCategory(value)}
        sx={{ mb: 4 }}
        variant="scrollable"
      >
        <Tab value="all" label="All Templates" />
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Tab 
            key={key} 
            value={key} 
            label={label}
            icon={categoryIcons[key as keyof typeof categoryIcons]}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {/* Template Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              {/* Template Preview */}
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.secondary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  {template.name}
                </Typography>
                {template.id === 'tech-course' && (
                  <Badge 
                    badgeContent={<FeaturedIcon sx={{ fontSize: 16 }} />} 
                    color="warning"
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                  />
                )}
              </CardMedia>

              {/* Template Info */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    {template.name}
                  </Typography>
                  <Chip 
                    label={categoryLabels[template.category]}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                {/* Features */}
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.primary">
                    Features:
                  </Typography>
                  {template.features.map((feature, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {feature}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onTemplateSelect(template)}
                  size="large"
                >
                  Use This Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No templates found in this category
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSelectedCategory('all')}
            sx={{ mt: 2 }}
          >
            View All Templates
          </Button>
        </Box>
      )}

      {/* Template Stats */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {templateLibrary.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Professional Templates
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              95%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mobile Responsive
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              2x
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Higher Conversion Rate
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};