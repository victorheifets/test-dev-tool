import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Chip,
  useTheme,
  alpha,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  CheckCircle,
  Visibility,
  Palette,
  BusinessCenter,
  Brush,
  FilterVintage,
  Computer,
  Whatshot,
} from '@mui/icons-material';
import { LANDING_TEMPLATES, getTemplateKeys } from '../../lib/landing/templates';
import type { TemplateSelectProps, TemplatePreview } from '../../types/landing';

const TEMPLATE_ICONS = {
  professional: BusinessCenter,
  creative: Brush,
  minimal: FilterVintage,
  tech: Computer,
  bold: Whatshot,
};

const TEMPLATE_THUMBNAILS = {
  professional: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&crop=center',
  creative: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop&crop=center',
  minimal: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&crop=center',
  tech: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&crop=center',
  bold: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&crop=center',
};

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  showPreview = true,
}: TemplateSelectProps) {
  const theme = useTheme();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const templates: TemplatePreview[] = getTemplateKeys().map((key) => {
    const template = LANDING_TEMPLATES[key];
    return {
      id: key,
      name: template.name,
      description: template.description,
      thumbnail: TEMPLATE_THUMBNAILS[key as keyof typeof TEMPLATE_THUMBNAILS],
      theme: template,
      tags: getTemplateTags(key),
      category: getCategoryFromTemplate(key),
      difficulty: getDifficultyFromTemplate(key),
    };
  });

  function getTemplateTags(templateKey: string): string[] {
    const tagMap = {
      professional: ['Business', 'Corporate', 'Clean'],
      creative: ['Artistic', 'Bold', 'Colorful'],
      minimal: ['Simple', 'Clean', 'Elegant'],
      tech: ['Modern', 'Technical', 'Sleek'],
      bold: ['High-Impact', 'Attention-Grabbing', 'Dynamic'],
    };
    return tagMap[templateKey as keyof typeof tagMap] || [];
  }

  function getCategoryFromTemplate(templateKey: string): string {
    const categoryMap = {
      professional: 'Business',
      creative: 'Creative',
      minimal: 'Minimal',
      tech: 'Technology',
      bold: 'Marketing',
    };
    return categoryMap[templateKey as keyof typeof categoryMap] || 'General';
  }

  function getDifficultyFromTemplate(templateKey: string): 'beginner' | 'intermediate' | 'advanced' {
    const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      professional: 'beginner',
      creative: 'intermediate',
      minimal: 'beginner',
      tech: 'intermediate',
      bold: 'advanced',
    };
    return difficultyMap[templateKey] || 'beginner';
  }

  const handleTemplateSelect = (templateId: string) => {
    onTemplateChange(templateId);
  };

  const handlePreview = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Preview functionality would be implemented here
    console.log('Preview template:', templateId);
  };

  const TemplateCard = ({ template }: { template: TemplatePreview }) => {
    const isSelected = selectedTemplate === template.id;
    const isHovered = hoveredTemplate === template.id;
    const IconComponent = TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS];

    return (
      <Zoom in timeout={300}>
        <Card
          sx={{
            position: 'relative',
            cursor: 'pointer',
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            boxShadow: isSelected
              ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
              : isHovered
              ? `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`
              : `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
            border: isSelected
              ? `2px solid ${theme.palette.primary.main}`
              : `2px solid transparent`,
            borderRadius: theme.spacing(2),
            overflow: 'hidden',
          }}
          onClick={() => handleTemplateSelect(template.id)}
          onMouseEnter={() => setHoveredTemplate(template.id)}
          onMouseLeave={() => setHoveredTemplate(null)}
        >
          {/* Selection Indicator */}
          {isSelected && (
            <Fade in>
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '50%',
                  padding: 0.5,
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </Fade>
          )}

          {/* Preview Button */}
          {showPreview && (isHovered || isSelected) && (
            <Fade in>
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 2,
                }}
              >
                <Tooltip title="Preview Template">
                  <IconButton
                    size="small"
                    onClick={(e) => handlePreview(template.id, e)}
                    sx={{
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        backgroundColor: theme.palette.common.white,
                      },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          )}

          {/* Template Thumbnail */}
          <CardMedia
            component="img"
            height="200"
            image={template.thumbnail}
            alt={template.name}
            sx={{
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />

          {/* Color Preview Strip */}
          <Box
            sx={{
              height: 8,
              background: `linear-gradient(90deg, 
                ${template.theme.colors.primary} 0%, 
                ${template.theme.colors.secondary} 50%, 
                ${template.theme.colors.accent} 100%)`,
            }}
          />

          <CardContent sx={{ padding: theme.spacing(2.5) }}>
            {/* Template Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: alpha(template.theme.colors.primary, 0.1),
                  color: template.theme.colors.primary,
                  mr: 1.5,
                }}
              >
                <IconComponent fontSize="small" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {template.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    letterSpacing: 0.5,
                  }}
                >
                  {template.category}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 2,
                lineHeight: 1.5,
                height: '3em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {template.description}
            </Typography>

            {/* Tags */}
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {template.tags.slice(0, 2).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    backgroundColor: alpha(template.theme.colors.primary, 0.08),
                    color: template.theme.colors.primary,
                    border: `1px solid ${alpha(template.theme.colors.primary, 0.2)}`,
                  }}
                />
              ))}
            </Stack>

            {/* Difficulty Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Palette
                  sx={{
                    fontSize: 16,
                    color: template.theme.colors.primary,
                    mr: 0.5,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: 'capitalize',
                    fontWeight: 500,
                  }}
                >
                  {template.difficulty}
                </Typography>
              </Box>
              
              {isSelected && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Selected
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Choose Your Template
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Select a professional template that matches your course style. Each template is optimized for conversions and mobile responsiveness.
        </Typography>
      </Box>

      {/* Template Grid */}
      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <TemplateCard template={template} />
          </Grid>
        ))}
      </Grid>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <Fade in>
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 1,
              }}
            >
              Selected: {LANDING_TEMPLATES[selectedTemplate]?.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 2,
              }}
            >
              {LANDING_TEMPLATES[selectedTemplate]?.description}
            </Typography>
            <Button
              variant="contained"
              onClick={() => onTemplateChange(selectedTemplate)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Continue with This Template
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
}