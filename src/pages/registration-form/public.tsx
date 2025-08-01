import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Button, 
  TextField, 
  FormControl, 
  FormLabel, 
  Select, 
  MenuItem, 
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Container,
  useMediaQuery,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save as SaveIcon } from '@mui/icons-material';
import { API_CONFIG } from '../../config/api';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  activity_of_interest?: string;
  notes?: string;
}

const PublicRegistrationForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formConfig, setFormConfig] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load form configuration from API
  React.useEffect(() => {
    const loadFormConfig = async () => {
      if (formId) {
        try {
          const response = await fetch(`${API_CONFIG.baseURL}/registration-forms/public/${formId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setFormConfig(result.data);
            }
          } else {
            console.error('Form not found or inactive');
          }
        } catch (error) {
          console.error('Failed to load form configuration:', error);
        }
      }
    };

    loadFormConfig();
  }, [formId]);

  // Fetch activities for the activity dropdown from public endpoint
  const [activities, setActivities] = useState<any[]>([]);
  
  React.useEffect(() => {
    const loadPublicActivities = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseURL}/public/activities`);
        if (response.ok) {
          const activitiesData = await response.json();
          setActivities(activitiesData || []);
        }
      } catch (error) {
        console.error('Failed to load public activities:', error);
        setActivities([]);
      }
    };

    loadPublicActivities();
  }, []);

  // Create validation schema with translated messages
  const validationSchemaWithTranslation: yup.ObjectSchema<FormData> = yup.object().shape({
    first_name: yup.string().required(t('validation.first_name_required')).min(1).max(100),
    last_name: yup.string().required(t('validation.last_name_required')).min(1).max(100),
    email: yup.string().email(t('validation.email_invalid')).required(t('validation.email_required')),
    phone: yup.string().optional().min(10, t('validation.phone_min_length')),
    source: yup.string().required(t('validation.source_required')),
    activity_of_interest: yup.string().optional(),
    notes: yup.string().optional()
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(validationSchemaWithTranslation),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      source: '',
      activity_of_interest: '',
      notes: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Create lead data with "qualified" status to indicate registration form submission
      const leadData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        source: data.source,
        status: 'qualified', // Use "qualified" status to differentiate registration forms from regular leads
        activity_of_interest: data.activity_of_interest || '',
        notes: data.notes ? `[Registration Form ${formId}] ${data.notes}` : `[Registration Form ${formId}] Submitted via public registration form`,
      };

      // Submit to public registration form endpoint
      const response = await fetch(`${API_CONFIG.baseURL}/registration-forms/public/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Registration form submitted as lead:', result);
      
      setSubmitted(true);
      setSnackbar({
        open: true,
        message: t('registrationForm.submitSuccess'),
        severity: 'success'
      });
      reset();
    } catch (error) {
      console.error('Registration form submission error:', error);
      setSnackbar({
        open: true,
        message: t('registrationForm.submitError'),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: isMobile ? 'background.default' : (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
        py: isMobile ? 0 : 4,
        px: isMobile ? 0 : 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth={isMobile ? false : "sm"} sx={{ 
          mt: isMobile ? 0 : 8,
          height: isMobile ? '100vh' : 'auto',
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'flex-start',
          alignItems: isMobile ? 'center' : 'stretch'
        }}>
          <Paper sx={{ 
            p: isMobile ? 3 : 4, 
            textAlign: 'center',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? 'auto' : 'auto',
            border: isMobile ? 'none' : '1px solid',
            borderColor: isMobile ? 'transparent' : 'divider',
            borderRadius: isMobile ? 0 : 2,
            boxShadow: isMobile ? 'none' : theme.shadows[3]
          }}>
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom color="success.main">
              {t('registrationForm.submitSuccess')}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Thank you for your registration. We will contact you soon!
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 4 }}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
              onClick={() => {
                setSubmitted(false);
                reset();
              }}
            >
              Submit Another Registration
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: isMobile ? 'background.default' : (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
      py: isMobile ? 0 : 4,
      px: isMobile ? 0 : 2,
      display: isMobile ? 'flex' : 'block',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <Container maxWidth={isMobile ? false : "md"} sx={{ 
        height: isMobile ? '100vh' : 'auto',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : 'row',
        p: isMobile ? 0 : 2
      }}>
        <Paper sx={{ 
          p: isMobile ? 3 : 4,
          height: isMobile ? '100%' : 'auto',
          border: isMobile ? 'none' : '1px solid',
          borderColor: isMobile ? 'transparent' : 'divider',
          borderRadius: isMobile ? 0 : 2,
          boxShadow: isMobile ? 'none' : theme.shadows[3],
          overflow: isMobile ? 'auto' : 'visible'
        }}>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            {formConfig?.title || t('registrationForm.defaultTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: isMobile ? 3 : 4 }}>
            {formConfig?.description || t('registrationForm.defaultDescription')}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('forms.first_name')}
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                      required
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('forms.last_name')}
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('common.email')}
                      type="email"
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('common.phone')}
                      type="tel"
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.source} size={isMobile ? "small" : "medium"}>
                      <FormLabel required>{t('forms.source')}</FormLabel>
                      <Select {...field} variant="outlined">
                        <MenuItem value="website">{t('registrationForm.sources.website')}</MenuItem>
                        <MenuItem value="social_media">{t('registrationForm.sources.social')}</MenuItem>
                        <MenuItem value="referral">{t('registrationForm.sources.referral')}</MenuItem>
                        <MenuItem value="email">{t('registrationForm.sources.email')}</MenuItem>
                        <MenuItem value="advertisement">{t('registrationForm.sources.advertisement')}</MenuItem>
                        <MenuItem value="other">{t('registrationForm.sources.other')}</MenuItem>
                      </Select>
                      {errors.source && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.source.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="activity_of_interest"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <FormLabel>{t('registrationForm.activityOfInterest')}</FormLabel>
                      <Select {...field} variant="outlined">
                        <MenuItem value="">{t('common.none')}</MenuItem>
                        {activities.map((activity) => (
                          <MenuItem key={activity.id} value={activity.id || ''}>
                            {activity.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('registrationForm.additionalNotes')}
                      variant="outlined"
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      multiline
                      rows={isMobile ? 3 : 4}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'center', 
                  gap: 2, 
                  mt: 2 
                }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset()}
                    disabled={isSubmitting}
                    size={isMobile ? "large" : "large"}
                    fullWidth={isMobile}
                  >
                    {t('actions.reset')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    size={isMobile ? "large" : "large"}
                    fullWidth={isMobile}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {isSubmitting ? t('registrationForm.submitting') : t('actions.submit')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PublicRegistrationForm;