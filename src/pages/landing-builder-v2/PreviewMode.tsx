import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Paper,
  Rating,
  Avatar,
  Chip,
  Divider,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Publish as PublishIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { LandingPageData } from './types';

interface PreviewModeProps {
  landingPageData: LandingPageData;
  onBack: () => void;
  onPublish: () => void;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({
  landingPageData,
  onBack,
  onPublish,
}) => {
  const SectionRenderer: React.FC<{ section: any }> = ({ section }) => {
    if (!section.visible) return null;

    switch (section.type) {
      case 'hero':
        return (
          <Box sx={{ 
            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            color: 'white',
            py: 8,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Container maxWidth="lg">
              <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                {section.content.headline}
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
                {section.content.subheadline}
              </Typography>
              
              {section.content.features && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                  {section.content.features.map((feature: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={feature} 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  ))}
                </Stack>
              )}

              {section.content.stats && (
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  {Object.entries(section.content.stats).map(([key, value]) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {value as string}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: '#ff6b6b', 
                  px: 6, 
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#ff5252' }
                }}
              >
                {section.content.ctaText}
              </Button>
            </Container>
          </Box>
        );

      case 'features':
        return (
          <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
              <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                {section.content.title}
              </Typography>
              {section.content.subtitle && (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                  {section.content.subtitle}
                </Typography>
              )}
              <Grid container spacing={4}>
                {section.content.features?.map((feature: any, index: number) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card sx={{ height: '100%', textAlign: 'center', p: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>{feature.icon}</Typography>
                      <Typography variant="h5" gutterBottom fontWeight="bold">{feature.title}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );

      case 'testimonials':
        return (
          <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
              <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                {section.content.title}
              </Typography>
              {section.content.subtitle && (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                  {section.content.subtitle}
                </Typography>
              )}
              <Grid container spacing={4}>
                {section.content.testimonials?.slice(0, 3).map((testimonial: any, index: number) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ p: 4, height: '100%' }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {testimonial.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                          {testimonial.company && (
                            <Typography variant="caption" color="text.secondary">
                              {testimonial.company}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      <Rating value={testimonial.rating || 5} readOnly sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{testimonial.text}"
                      </Typography>
                      {testimonial.salaryIncrease && (
                        <Chip 
                          label={`Salary increase: ${testimonial.salaryIncrease}`}
                          color="success"
                          size="small"
                          sx={{ mt: 2 }}
                        />
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );

      case 'pricing':
        return (
          <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
            <Container maxWidth="md">
              <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                {section.content.title}
              </Typography>
              {section.content.subtitle && (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                  {section.content.subtitle}
                </Typography>
              )}
              
              {section.content.plans ? (
                <Grid container spacing={3}>
                  {section.content.plans.map((plan: any, index: number) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{ 
                        p: 4, 
                        textAlign: 'center', 
                        height: '100%',
                        position: 'relative',
                        ...(plan.popular && {
                          border: '3px solid',
                          borderColor: 'primary.main',
                          transform: 'scale(1.05)'
                        })
                      }}>
                        {plan.popular && (
                          <Chip 
                            label="Most Popular" 
                            color="primary" 
                            sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}
                          />
                        )}
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {plan.name}
                        </Typography>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          {plan.price}
                        </Typography>
                        {plan.originalPrice && (
                          <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            {plan.originalPrice}
                          </Typography>
                        )}
                        <Divider sx={{ my: 3 }} />
                        <Stack spacing={2}>
                          {plan.features?.map((feature: string, fIndex: number) => (
                            <Typography key={fIndex} variant="body1">
                              <CheckIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                              {feature}
                            </Typography>
                          ))}
                        </Stack>
                        <Button 
                          variant={plan.popular ? "contained" : "outlined"}
                          fullWidth 
                          size="large" 
                          sx={{ mt: 4 }}
                        >
                          Choose Plan
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card sx={{ maxWidth: 500, mx: 'auto', p: 4, textAlign: 'center' }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {section.content.price}
                      </Typography>
                      {section.content.originalPrice && (
                        <Typography 
                          variant="h5" 
                          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                        >
                          {section.content.originalPrice}
                        </Typography>
                      )}
                      {section.content.discount && (
                        <Chip label={section.content.discount} color="error" sx={{ mt: 1 }} />
                      )}
                    </Box>
                    
                    <Divider />
                    
                    <Stack spacing={1}>
                      {section.content.features?.map((feature: string, index: number) => (
                        <Typography key={index} variant="body1">
                          <CheckIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                          {feature}
                        </Typography>
                      ))}
                    </Stack>
                    
                    <Button variant="contained" size="large" sx={{ py: 2 }}>
                      Enroll Now
                    </Button>
                    
                    {section.content.guarantee && (
                      <Typography variant="body2" color="text.secondary">
                        {section.content.guarantee}
                      </Typography>
                    )}
                    
                    {section.content.urgency && (
                      <Chip label={section.content.urgency} color="warning" />
                    )}
                  </Stack>
                </Card>
              )}
            </Container>
          </Box>
        );

      case 'signup':
        return (
          <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
            <Container maxWidth="md">
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  {section.content.title}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {section.content.subtitle}
                </Typography>
              </Box>
              
              <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
                <Stack spacing={3}>
                  {section.content.formFields?.map((field: any, index: number) => (
                    <TextField
                      key={index}
                      label={field.label}
                      type={field.type}
                      fullWidth
                      required={field.required}
                      multiline={field.type === 'textarea'}
                      rows={field.type === 'textarea' ? 3 : 1}
                      placeholder={field.placeholder}
                      variant="outlined"
                    />
                  ))}
                  
                  <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth
                    sx={{ py: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    {section.content.ctaText}
                  </Button>
                  
                  {section.content.benefits && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom color="text.secondary">
                        What happens next:
                      </Typography>
                      {section.content.benefits.map((benefit: string, index: number) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          <CheckIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                          {benefit}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Container>
          </Box>
        );

      case 'stats':
        return (
          <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
            <Container maxWidth="lg">
              <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
                {section.content.title}
              </Typography>
              {section.content.subtitle && (
                <Typography variant="h6" align="center" sx={{ mb: 6, opacity: 0.9 }}>
                  {section.content.subtitle}
                </Typography>
              )}
              <Grid container spacing={4}>
                {section.content.stats?.map((stat: any, index: number) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box textAlign="center">
                      <Typography variant="h2" fontWeight="bold" gutterBottom>
                        {stat.number}
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Fixed Header */}
      <AppBar position="fixed" sx={{ bgcolor: 'background.paper', color: 'text.primary' }} elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Preview: {landingPageData.title}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onBack}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={onPublish}
              color="success"
            >
              Publish
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Page Content */}
      <Box sx={{ mt: 8 }}>
        {landingPageData.sections
          .filter(section => section.visible)
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={onPublish}
      >
        <PublishIcon />
      </Fab>
    </Box>
  );
};