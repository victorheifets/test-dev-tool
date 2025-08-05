import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_CONFIG, getAuthHeaders } from '../../config/api';

// Helper function for text direction - simple approach
const getTextDirection = (currentLanguage: string) => {
  return currentLanguage === 'he' ? 'rtl' : 'ltr';
};
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
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Fab,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Edit as EditIcon, Preview as PreviewIcon, Publish as PublishIcon, Save as SaveIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { CommonModalShell } from '../../components/common/CommonModalShell';
import { useCreate, useList, useInvalidate } from '@refinedev/core';

// FAB positioning constants
const FAB_BOTTOM_OFFSET = 90; // Above bottom navigation
const FAB_Z_INDEX = 1000;

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  activity_of_interest?: string;
  notes?: string;
}

interface FormSettings {
  title: string;
  description: string;
  published: boolean;
  publishedUrl?: string;
  testField1?: string;
}

// Extract preview content into separate component
interface PreviewContentProps {
  formSettings: FormSettings;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ formSettings }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  
  const FormPreview = () => (
    <Box sx={{ 
      p: isMobile ? 2 : 3, 
      backgroundColor: isMobile ? 'grey.50' : 'background.paper',
      borderRadius: 2,
      border: isMobile ? 'none' : '1px solid',
      borderColor: 'divider'
    }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600 }}>
        {formSettings.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {formSettings.testField1}
      </Typography>
      
      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t('forms.first_name')}
            variant="outlined"
            fullWidth
            disabled
            value="John"
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t('forms.last_name')}
            variant="outlined"
            fullWidth
            disabled
            value="Doe"
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t('common.email')}
            variant="outlined"
            fullWidth
            disabled
            value="john.doe@example.com"
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t('common.phone')}
            variant="outlined"
            fullWidth
            disabled
            value="+1234567890"
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth disabled size={isMobile ? "small" : "medium"}>
            <FormLabel>{t('forms.source')}</FormLabel>
            <Select value="website">
              <MenuItem value="website">Website</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  return <FormPreview />;
};

// Extract publish content into separate component
const PublishContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Typography>
      {t('registrationForm.publishConfirmation')}
    </Typography>
  );
};

const RegistrationFormNew: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isMobile } = useBreakpoint();
  const currentLanguage = i18n.language;
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingTestField1, setEditingTestField1] = useState(false);
  const invalidate = useInvalidate();

  // Function to handle text direction
  const handleTextDirection = (text: string = '') => {
    // Check if the text contains RTL characters
    const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlChars.test(text) ? 'rtl' : 'ltr';
  };
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [mobileTab, setMobileTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: t('registrationForm.defaultTitle'),
    description: t('registrationForm.defaultDescription'),
    published: false,
    publishedUrl: undefined,
    testField1: currentLanguage === 'he' ? 'הצטרפו אלינו ללמידה מרתקת וחווית לימוד בלתי נשכחת' : 'Join us for exciting learning and an unforgettable educational experience'
  });
  

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

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
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

  // Use the useCreate hook for better error handling and integration
  const { mutate: createLead } = useCreate();
  
  // Fetch activities for the activity dropdown
  const { data: activitiesData } = useList({
    resource: 'activities',
  });
  
  const activities = activitiesData?.data || [];

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
        notes: data.notes ? `[Registration Form] ${data.notes}` : '[Registration Form] Submitted via registration form',
      };

      // Submit to leads API using Refine's useCreate hook
      createLead(
        {
          resource: 'leads',
          values: leadData,
          successNotification: false,
          errorNotification: false,
        },
        {
          onSuccess: (result) => {
            console.log('Registration form submitted as lead:', result);
            setSnackbar({
              open: true,
              message: t('registrationForm.submitSuccess'),
              severity: 'success'
            });
            reset();
          },
          onError: (error) => {
            console.error('Registration form submission error:', error);
            setSnackbar({
              open: true,
              message: t('registrationForm.submitError'),
              severity: 'error'
            });
          },
        }
      );
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

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Call the backend API to publish the form
      const response = await fetch(`${API_CONFIG.baseURL}/registration-forms/publish`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formSettings.title,
          description: formSettings.testField1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.form_id) {
        const publicUrl = `${window.location.origin}/public/registration/${result.data.form_id}`;
        setFormSettings(prev => ({
          ...prev,
          published: true,
          publishedUrl: publicUrl
        }));
        
        setSnackbar({
          open: true,
          message: t('registrationForm.publishSuccess'),
          severity: 'success'
        });
        setPublishDialogOpen(false);
        
        // Invalidate registration-forms cache so CRUD table shows the new form
        invalidate({ resource: 'registration-forms', invalidates: ['list'] });
      } else {
        throw new Error('Failed to publish form - no form ID returned');
      }
    } catch (error) {
      console.error('Form publish error:', error);
      setSnackbar({
        open: true,
        message: t('registrationForm.publishError'),
        severity: 'error'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => (
    <div hidden={value !== index}>
      {value === index && children}
    </div>
  );

  // Main form content
  const FormContent = () => (
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
                InputProps={{
                  sx: {
                    '& textarea': {
                      direction: 'ltr !important',
                      textAlign: 'left !important',
                      unicodeBidi: 'normal !important'
                    }
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'flex-end', 
            gap: 2, 
            mt: 2 
          }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset()}
              disabled={isSubmitting}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              {t('actions.reset')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {isSubmitting ? t('registrationForm.submitting') : t('actions.submit')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Settings content
  const SettingsContent = () => (
    <Box>
      <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
        {t('registrationForm.formSettings')}
      </Typography>
      
      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingTitle ? (
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                value={formSettings.title}
                onChange={(e) => setFormSettings(prev => ({ ...prev, title: e.target.value }))}
                onBlur={() => setEditingTitle(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                autoFocus
              />
            ) : (
              <>
                <Typography variant={isMobile ? "body1" : "h6"} sx={{ flexGrow: 1 }}>
                  {formSettings.title}
                </Typography>
                <IconButton 
                  onClick={() => setEditingTitle(true)}
                  size={isMobile ? "small" : "medium"}
                >
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingTestField1 ? (
              <TextField
                fullWidth
                size="small"
                value={formSettings.testField1}
                onChange={(e) => setFormSettings(prev => ({ ...prev, testField1: e.target.value }))}
                onBlur={() => setEditingTestField1(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTestField1(false)}
                autoFocus
              />
            ) : (
              <>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {formSettings.testField1}
                </Typography>
                <IconButton 
                  onClick={() => setEditingTestField1(true)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>



        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formSettings.published}
                onChange={(e) => setFormSettings(prev => ({ ...prev, published: e.target.checked }))}
                size={isMobile ? "small" : "medium"}
              />
            }
            label={t('registrationForm.published')}
          />
          {formSettings.publishedUrl && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1F2937' : 'background.paper', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? '#4B5563' : 'divider', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {t('registrationForm.publishedUrl')}:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  backgroundColor: 'background.paper',
                  p: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                {formSettings.publishedUrl}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => formSettings.publishedUrl && navigator.clipboard.writeText(formSettings.publishedUrl)}
                >
                  Copy URL
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => formSettings.publishedUrl && window.open(formSettings.publishedUrl, '_blank')}
                >
                  Open Form
                </Button>
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2 
          }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              {t('registrationForm.buttons.preview')}
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={() => setPublishDialogOpen(true)}
              disabled={formSettings.published}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              {t('registrationForm.buttons.publish')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%',
      pb: isMobile ? 10 : 3, // Match participants page mobile padding
      px: isMobile ? 1 : 3,  // Add desktop padding
      pt: isMobile ? 1 : 3,  // Add top padding
      minHeight: isMobile ? 'auto' : '100vh',
    }}>

      {/* Mobile Tab Navigation */}
        {isMobile && (
          <Paper sx={{ position: 'sticky', top: 0, zIndex: 1, mb: 2 }}>
            <Tabs
              value={mobileTab}
              onChange={(_, newValue) => setMobileTab(newValue)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label={t('registrationForm.tabs.form')} />
              <Tab label={t('registrationForm.tabs.settings')} />
            </Tabs>
          </Paper>
        )}

        {/* Desktop Layout */}
        {!isMobile && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="h5" gutterBottom>
                  {t('registrationForm.formTitle')}
                </Typography>
                <FormContent />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <SettingsContent />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            <TabPanel value={mobileTab} index={0}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50',
                borderRadius: 2,
                minHeight: '60vh'
              }}>
                <FormContent />
              </Box>
            </TabPanel>
            <TabPanel value={mobileTab} index={1}>
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50',
                borderRadius: 2,
                minHeight: '60vh'
              }}>
                <SettingsContent />
              </Box>
            </TabPanel>
          </>
        )}

        {/* FAB for mobile settings */}
        {isMobile && mobileTab === 0 && (
          <Fab
            color="secondary"
            onClick={() => setMobileTab(1)}
            sx={{
              position: 'fixed',
              bottom: FAB_BOTTOM_OFFSET, // Above bottom navigation
              right: 16,
              zIndex: FAB_Z_INDEX,
            }}
          >
            <SettingsIcon />
          </Fab>
        )}

        {/* Preview Modal using CommonModalShell */}
        <CommonModalShell
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={t('registrationForm.buttons.preview')}
          forceMobile={true}
          maxWidth={isMobile ? false : "md"}
          fullScreen={isMobile}
          showActions={false}
        >
          <Box sx={{ mt: isMobile ? 1 : 2 }}>
            <PreviewContent formSettings={formSettings} />
          </Box>
        </CommonModalShell>

        {/* Publish Modal using CommonModalShell */}
        <CommonModalShell
          open={publishDialogOpen}
          onClose={() => setPublishDialogOpen(false)}
          title={t('registrationForm.buttons.publish')}
          forceMobile={isMobile}
          maxWidth="sm"
          showActions={true}
          onCancel={() => setPublishDialogOpen(false)}
          onSave={handlePublish}
          cancelButtonText={t('actions.cancel')}
          saveButtonText={t('registrationForm.buttons.publish')}
          saveButtonDisabled={isPublishing}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            mt: isMobile ? 1 : 2,
            p: isMobile ? 1 : 2
          }}>
            {isPublishing && <CircularProgress size={20} />}
            <PublishContent />
          </Box>
        </CommonModalShell>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default RegistrationFormNew;