import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Stack,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Fab,
  useTheme,
  alpha,
  Rating,
  Divider,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  Star,
  AccessTime,
  School,
  TrendingUp,
  Security,
  Support,
  Edit,
  Visibility,
} from '@mui/icons-material';
import type { LivePreviewProps, LeadData } from '../../types/landing';

export default function LivePreview({
  data,
  template,
  isPublic = false,
  showControls = true,
  onEdit,
}: LivePreviewProps) {
  const theme = useTheme();
  const [leadForm, setLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.lastName || !leadForm.email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setLeadForm({ firstName: '', lastName: '', email: '', phone: '' });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setLeadForm(prev => ({ ...prev, [field]: value }));
  };

  // Template colors and styling
  const templateColors = template.colors;
  const templateFonts = template.fonts;
  const templateSpacing = template.spacing;

  // Hero Section Component
  const HeroSection = () => (
    <Box
      sx={{
        background: template.gradients.hero,
        color: 'white',
        py: { xs: 8, md: parseInt(templateSpacing.heroHeight) / 8 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop") center/cover`,
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 800,
                  fontFamily: templateFonts.heading,
                  lineHeight: 1.1,
                  mb: 3,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
                dangerouslySetInnerHTML={{ __html: data.content.hero.title }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontFamily: templateFonts.body,
                  lineHeight: 1.4,
                  mb: 3,
                  opacity: 0.95,
                }}
                dangerouslySetInnerHTML={{ __html: data.content.hero.subtitle }}
              />
              <Box
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 4,
                  '& p': { mb: 2 },
                  '& ul': { pl: 2 },
                  '& li': { mb: 1 },
                  '& strong': { fontWeight: 700 },
                }}
                dangerouslySetInnerHTML={{ __html: data.content.hero.description }}
              />
            </Box>

            {/* Trust Indicators */}
            <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ color: '#ffd700', mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  4.9/5 Rating
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  5,247+ Students
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Self-Paced
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              size="large"
              href="#enrollment"
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: template.borderRadius.medium,
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                color: 'white',
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                },
              }}
            >
              {data.content.hero.buttonText}
            </Button>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Lead Capture Form */}
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: template.borderRadius.large,
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: template.shadows.hero,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: templateFonts.heading,
                  fontWeight: 700,
                  color: templateColors.primary,
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                Start Learning Today!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: templateColors.textSecondary,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                Join 5,247+ students already enrolled
              </Typography>

              {/* Pricing Display */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: templateColors.primary,
                    fontFamily: templateFonts.heading,
                  }}
                >
                  {data.content.pricing.price}
                </Typography>
                {data.content.pricing.originalPrice && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: templateColors.textSecondary,
                        display: 'inline',
                        ml: 1,
                      }}
                    >
                      {data.content.pricing.originalPrice}
                    </Typography>
                    <Chip
                      label="Limited Time!"
                      color="error"
                      size="small"
                      sx={{ ml: 1, fontWeight: 600 }}
                    />
                  </>
                )}
              </Box>

              {showSuccess ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: 'success.main',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Thank You!
                  </Typography>
                  <Typography variant="body2">
                    We'll contact you soon with enrollment details.
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={leadForm.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: template.borderRadius.small,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={leadForm.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: template.borderRadius.small,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: template.borderRadius.small,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      value={leadForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: template.borderRadius.small,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isSubmitting || !leadForm.firstName || !leadForm.lastName || !leadForm.email}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: template.borderRadius.medium,
                        backgroundColor: templateColors.primary,
                        boxShadow: template.shadows.button,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: templateColors.secondary,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 6px 20px ${alpha(templateColors.primary, 0.4)}`,
                        },
                      }}
                    >
                      {isSubmitting ? 'Enrolling...' : data.content.pricing.buttonText}
                    </Button>
                  </Stack>
                </form>
              )}

              {/* Trust Badges */}
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 3, flexWrap: 'wrap' }}
              >
                {['30-Day Guarantee', 'Instant Access', 'Lifetime Updates'].map((badge) => (
                  <Chip
                    key={badge}
                    label={badge}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: alpha(templateColors.primary, 0.3),
                      color: templateColors.primary,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Features Section Component
  const FeaturesSection = () => (
    <Box
      sx={{
        py: { xs: 8, md: parseInt(templateSpacing.sectionPadding) / 8 },
        background: template.gradients.section,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              fontFamily: templateFonts.heading,
              color: templateColors.primary,
              mb: 2,
            }}
            dangerouslySetInnerHTML={{ __html: data.content.features.title }}
          />
          <Typography
            variant="h5"
            sx={{
              fontSize: '1.2rem',
              color: templateColors.textSecondary,
              maxWidth: 600,
              mx: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: data.content.features.subtitle }}
          />
        </Box>

        <Grid container spacing={4}>
          {data.content.features.items.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={feature.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: template.borderRadius.medium,
                  boxShadow: template.shadows.card,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${alpha(templateColors.primary, 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${alpha(templateColors.primary, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: template.borderRadius.medium,
                      backgroundColor: alpha(templateColors.primary, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 32,
                        color: templateColors.primary,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontFamily: templateFonts.heading,
                      color: templateColors.text,
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: templateColors.textSecondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  // Instructor Section Component
  const InstructorSection = () => (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: templateColors.background }}>
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: template.borderRadius.large,
            boxShadow: template.shadows.card,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 700,
              fontFamily: templateFonts.heading,
              color: templateColors.primary,
              mb: 4,
            }}
            dangerouslySetInnerHTML={{ __html: data.content.instructor.title }}
          />

          <Avatar
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              border: `4px solid ${templateColors.primary}`,
              boxShadow: `0 8px 32px ${alpha(templateColors.primary, 0.3)}`,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontFamily: templateFonts.heading,
              color: templateColors.text,
              mb: 1,
            }}
          >
            {data.content.instructor.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: templateColors.secondary,
              mb: 3,
              fontWeight: 500,
            }}
          >
            {data.content.instructor.credentials}
          </Typography>

          <Box
            sx={{
              textAlign: 'left',
              '& p': { mb: 2, lineHeight: 1.6 },
              '& ul': { pl: 2, mb: 2 },
              '& li': { mb: 1 },
              '& strong': { color: templateColors.primary, fontWeight: 600 },
              '& em': { color: templateColors.secondary, fontStyle: 'italic' },
            }}
            dangerouslySetInnerHTML={{ __html: data.content.instructor.bio }}
          />

          <Rating
            value={5}
            readOnly
            sx={{
              mt: 3,
              '& .MuiRating-iconFilled': {
                color: '#ffd700',
              },
            }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: templateColors.textSecondary }}>
            Rated 5.0/5 by 2,847+ students
          </Typography>
        </Paper>
      </Container>
    </Box>
  );

  // Contact Section Component
  const ContactSection = () => (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: templateColors.primary,
        color: 'white',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontFamily: templateFonts.heading,
            textAlign: 'center',
            mb: 6,
          }}
        >
          Questions? Get in Touch
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Phone sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Call Us
            </Typography>
            <Typography variant="body1">+1 (555) 123-4567</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Email sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Email Us
            </Typography>
            <Typography variant="body1">hello@courseplatform.com</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Support sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Support
            </Typography>
            <Typography variant="body1">24/7 Help Center</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Edit Controls (for editor mode) */}
      {!isPublic && showControls && onEdit && (
        <Fab
          color="primary"
          onClick={onEdit}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: template.shadows.button,
          }}
        >
          <Edit />
        </Fab>
      )}

      {/* Landing Page Content */}
      <HeroSection />
      <FeaturesSection />
      <InstructorSection />
      <Box id="enrollment" />
      <ContactSection />
    </Box>
  );
}