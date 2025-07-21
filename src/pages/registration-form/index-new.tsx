import React, { useState } from 'react';
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
}

// Extract preview content into separate component
const PreviewContent: React.FC = () => {
  const { t } = useTranslation();
  
  const FormPreview = () => (
    <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {t('registrationForm.defaultTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('registrationForm.defaultDescription')}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t('forms.first_name')}
            variant="outlined"
            fullWidth
            disabled
            value="John"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t('forms.last_name')}
            variant="outlined"
            fullWidth
            disabled
            value="Doe"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t('common.email')}
            variant="outlined"
            fullWidth
            disabled
            value="john.doe@example.com"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t('common.phone')}
            variant="outlined"
            fullWidth
            disabled
            value="+1234567890"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth disabled>
            <FormLabel>{t('forms.source')}</FormLabel>
            <Select value="website">
              <MenuItem value="website">Website</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
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
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
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
    publishedUrl: undefined
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

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
      setSnackbar({
        open: true,
        message: t('registrationForm.submitSuccess'),
        severity: 'success'
      });
      reset();
    } catch (error) {
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
      // Simulate publish API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const publishedUrl = `https://forms.example.com/${Date.now()}`;
      setFormSettings(prev => ({
        ...prev,
        published: true,
        publishedUrl
      }));
      setSnackbar({
        open: true,
        message: t('registrationForm.publishSuccess'),
        severity: 'success'
      });
      setPublishDialogOpen(false);
    } catch (error) {
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
      <Grid container spacing={3}>
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
              <FormControl fullWidth error={!!errors.source}>
                <FormLabel required>{t('forms.source')}</FormLabel>
                <Select {...field} variant="outlined">
                  <MenuItem value="website">{t('registrationForm.sources.website')}</MenuItem>
                  <MenuItem value="social">{t('registrationForm.sources.social')}</MenuItem>
                  <MenuItem value="referral">{t('registrationForm.sources.referral')}</MenuItem>
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
              <FormControl fullWidth>
                <FormLabel>{t('registrationForm.activityOfInterest')}</FormLabel>
                <Select {...field} variant="outlined">
                  <MenuItem value="">{t('common.none')}</MenuItem>
                  <MenuItem value="course1">{t('registrationForm.activities.course1')}</MenuItem>
                  <MenuItem value="course2">{t('registrationForm.activities.course2')}</MenuItem>
                  <MenuItem value="workshop">{t('registrationForm.activities.workshop')}</MenuItem>
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
                multiline
                rows={4}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              {t('actions.reset')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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
      <Typography variant="h6" gutterBottom>
        {t('registrationForm.formSettings')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingTitle ? (
              <TextField
                fullWidth
                value={formSettings.title}
                onChange={(e) => setFormSettings(prev => ({ ...prev, title: e.target.value }))}
                onBlur={() => setEditingTitle(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                autoFocus
              />
            ) : (
              <>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {formSettings.title}
                </Typography>
                <IconButton onClick={() => setEditingTitle(true)}>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingDescription ? (
              <TextField
                fullWidth
                multiline
                value={formSettings.description}
                onChange={(e) => setFormSettings(prev => ({ ...prev, description: e.target.value }))}
                onBlur={() => setEditingDescription(false)}
                autoFocus
              />
            ) : (
              <>
                <Typography sx={{ flexGrow: 1 }}>
                  {formSettings.description}
                </Typography>
                <IconButton onClick={() => setEditingDescription(true)}>
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
              />
            }
            label={t('registrationForm.published')}
          />
          {formSettings.publishedUrl && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('registrationForm.publishedUrl')}: {formSettings.publishedUrl}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              {t('registrationForm.buttons.preview')}
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishIcon />}
              onClick={() => setPublishDialogOpen(true)}
              disabled={formSettings.published}
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
      {/* Page Title - Desktop Only */}
      {!isMobile && (
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {t('registrationForm.title')}
        </Typography>
      )}

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
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {t('registrationForm.formTitle')}
                </Typography>
                <FormContent />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <SettingsContent />
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            <TabPanel value={mobileTab} index={0}>
              <Paper sx={{ p: 2 }}>
                <FormContent />
              </Paper>
            </TabPanel>
            <TabPanel value={mobileTab} index={1}>
              <Paper sx={{ p: 2 }}>
                <SettingsContent />
              </Paper>
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
          forceMobile={isMobile}
          maxWidth="md"
          showActions={true}
          onCancel={() => setPreviewOpen(false)}
          cancelButtonText={t('actions.close')}
          onSave={undefined} // No save action for preview
        >
          <PreviewContent />
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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