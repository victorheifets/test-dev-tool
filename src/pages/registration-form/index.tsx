import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Create } from '@refinedev/mui';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Edit as EditIcon, Preview as PreviewIcon, Publish as PublishIcon, Save as SaveIcon } from '@mui/icons-material';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source: string;
  activity_of_interest: string;
  notes: string;
}

interface FormSettings {
  title: string;
  description: string;
  published: boolean;
  publishedUrl?: string;
}

const RegistrationForm: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
  const validationSchemaWithTranslation = yup.object({
    first_name: yup.string().required(t('validation.first_name_required')).min(1).max(100),
    last_name: yup.string().required(t('validation.last_name_required')).min(1).max(100),
    email: yup.string().email(t('validation.email_invalid')).required(t('validation.email_required')),
    phone: yup.string().min(10, t('validation.phone_min_length')),
    source: yup.string().required(t('validation.source_required')),
    activity_of_interest: yup.string(),
    notes: yup.string().max(2000, t('validation.notes_max_length'))
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(validationSchemaWithTranslation),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      source: 'website',
      activity_of_interest: '',
      notes: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // For now, simulate successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Connect to proper API endpoint when backend is ready
      console.log('Form submitted:', data);

      setSnackbar({
        open: true,
        message: t('registrationForm.messages.saved'),
        severity: 'success'
      });

      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('messages.error'),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Create the form data to publish
      const formData = {
        title: formSettings.title,
        description: formSettings.description,
        fields: [
          { name: 'first_name', type: 'text', label: t('registrationForm.fields.fullName'), required: true },
          { name: 'last_name', type: 'text', label: t('common.last_name'), required: true },
          { name: 'email', type: 'email', label: t('registrationForm.fields.email'), required: true },
          { name: 'phone', type: 'tel', label: t('registrationForm.fields.phone'), required: false },
          { name: 'source', type: 'select', label: t('forms.source'), required: true, options: [
            { value: 'website', label: t('sources.website') },
            { value: 'referral', label: t('sources.referral') },
            { value: 'social_media', label: t('sources.social_media') },
            { value: 'email', label: t('sources.email') },
            { value: 'advertisement', label: t('sources.advertisement') },
            { value: 'other', label: t('sources.other') }
          ]},
          { name: 'activity_of_interest', type: 'text', label: t('forms.activity_of_interest'), required: false },
          { name: 'notes', type: 'textarea', label: t('forms.notes'), required: false }
        ],
        createdAt: new Date().toISOString(),
        language: 'en' // You can make this dynamic based on current language
      };

      // Create the HTML content for the published form
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formSettings.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-container { background: #f9f9f9; padding: 30px; border-radius: 8px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #1976d2; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #1565c0; }
        .required { color: red; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>${formSettings.title}</h1>
        <p>${formSettings.description}</p>
        <form id="registrationForm" method="POST" action="/api/registration-submit">
            <div class="form-group">
                <label for="first_name">${t('registrationForm.fields.fullName')} <span class="required">*</span></label>
                <input type="text" id="first_name" name="first_name" required>
            </div>
            <div class="form-group">
                <label for="last_name">${t('common.last_name')} <span class="required">*</span></label>
                <input type="text" id="last_name" name="last_name" required>
            </div>
            <div class="form-group">
                <label for="email">${t('registrationForm.fields.email')} <span class="required">*</span></label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">${t('registrationForm.fields.phone')}</label>
                <input type="tel" id="phone" name="phone">
            </div>
            <div class="form-group">
                <label for="source">${t('forms.source')} <span class="required">*</span></label>
                <select id="source" name="source" required>
                    <option value="website">${t('sources.website')}</option>
                    <option value="referral">${t('sources.referral')}</option>
                    <option value="social_media">${t('sources.social_media')}</option>
                    <option value="email">${t('sources.email')}</option>
                    <option value="advertisement">${t('sources.advertisement')}</option>
                    <option value="other">${t('sources.other')}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="activity_of_interest">${t('forms.activity_of_interest')}</label>
                <input type="text" id="activity_of_interest" name="activity_of_interest">
            </div>
            <div class="form-group">
                <label for="notes">${t('forms.notes')}</label>
                <textarea id="notes" name="notes" rows="4"></textarea>
            </div>
            <button type="submit">${t('landing_pages.forms.submit')}</button>
        </form>
    </div>
    <script>
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('${t('registrationForm.messages.saved')}');
        });
    </script>
</body>
</html>`;

      // Save the form to the server
      const response = await fetch('/api/forms/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          htmlContent,
          fileName: `${formSettings.title.replace(/[^a-zA-Z0-9]/g, '_')}_form.html`
        })
      });

      if (!response.ok) {
        // If server endpoint doesn't exist, fallback to client-side simulation
        if (response.status === 404 || response.status === 405) {
          // Create a blob and download URL for the HTML file (fallback)
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          // Create a temporary download link
          const a = document.createElement('a');
          a.href = url;
          a.download = `${formSettings.title.replace(/[^a-zA-Z0-9]/g, '_')}_form.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Create a mock published URL for demo
          const publishedUrl = `https://forms.${window.location.hostname}/registration/${Date.now()}`;
          
          setFormSettings(prev => ({
            ...prev,
            published: true,
            publishedUrl
          }));
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } else {
        // Server successfully published the form
        const result = await response.json();
        
        setFormSettings(prev => ({
          ...prev,
          published: true,
          publishedUrl: result.publishedUrl
        }));
      }

      setPublishDialogOpen(false);
      setSnackbar({
        open: true,
        message: t('registrationForm.messages.published'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Publishing failed:', error);
      setSnackbar({
        open: true,
        message: t('registrationForm.messages.publishing_failed'),
        severity: 'error'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveSettings = () => {
    setSnackbar({
      open: true,
      message: t('registrationForm.messages.saved'),
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const FormPreview = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {formSettings.title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {formSettings.description}
      </Typography>

      <Paper elevation={2} sx={{ p: 4, boxShadow: 6, border: '1px solid', borderColor: 'divider' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('registrationForm.fields.fullName')}
                    placeholder={t('registrationForm.fields.fullNamePlaceholder')}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    required
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('common.last_name')}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    required
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    label={t('registrationForm.fields.email')}
                    placeholder={t('registrationForm.fields.emailPlaceholder')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="tel"
                    label={t('registrationForm.fields.phone')}
                    placeholder={t('registrationForm.fields.phonePlaceholder')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Source */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <FormLabel>{t('forms.source')}</FormLabel>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      error={!!errors.source}
                    >
                      <MenuItem value="website">{t('sources.website')}</MenuItem>
                      <MenuItem value="referral">{t('sources.referral')}</MenuItem>
                      <MenuItem value="social_media">{t('sources.social_media')}</MenuItem>
                      <MenuItem value="email">{t('sources.email')}</MenuItem>
                      <MenuItem value="advertisement">{t('sources.advertisement')}</MenuItem>
                      <MenuItem value="other">{t('sources.other')}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Activity of Interest */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="activity_of_interest"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('forms.activity_of_interest')}
                    placeholder={t('forms.placeholder_activity_interest')}
                    error={!!errors.activity_of_interest}
                    helperText={errors.activity_of_interest?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label={t('forms.notes')}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );

  return (
    <Create 
      title={t('registrationForm.title')}
      breadcrumb={null}
      saveButtonProps={{ style: { display: 'none' } }}
      headerButtons={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            {t('registrationForm.buttons.save')}
          </Button>
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
            disabled={isPublishing}
            sx={{ 
              backgroundColor: '#7367F0', 
              '&:hover': { backgroundColor: '#5a52cc' },
              '&:disabled': { backgroundColor: '#b8b2ff' }
            }}
          >
            {isPublishing ? t('registrationForm.publishing') : t('registrationForm.buttons.publish')}
          </Button>
        </Box>
      }
    >
      <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1.5, boxShadow: 6, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={3}>
        {/* Form Settings */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {t('registrationForm.title')}
            </Typography>
              <Grid container spacing={2}>
                {/* Editable Title */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    backgroundColor: 'white',
                    boxShadow: 1,
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    {editingTitle ? (
                      <TextField
                        fullWidth
                        value={formSettings.title}
                        onChange={(e) => setFormSettings(prev => ({ ...prev, title: e.target.value }))}
                        onBlur={() => setEditingTitle(false)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                        autoFocus
                        label={t('registrationForm.fields.title')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ flex: 1, fontWeight: 500 }}>
                          {formSettings.title}
                        </Typography>
                        <IconButton onClick={() => setEditingTitle(true)} size="small">
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Grid>

                {/* Editable Description */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 1, 
                    backgroundColor: 'white',
                    boxShadow: 1,
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 1 
                  }}>
                    {editingDescription ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={formSettings.description}
                        onChange={(e) => setFormSettings(prev => ({ ...prev, description: e.target.value }))}
                        onBlur={() => setEditingDescription(false)}
                        autoFocus
                        label={t('registrationForm.fields.description')}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <>
                        <Typography variant="body1" color="text.secondary" sx={{ flex: 1, lineHeight: 1.5 }}>
                          {formSettings.description}
                        </Typography>
                        <IconButton onClick={() => setEditingDescription(true)} size="small">
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Publishing Status */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formSettings.published}
                        disabled
                        color="success"
                      />
                    }
                    label={formSettings.published ? t('registrationForm.status.published') : t('registrationForm.status.draft')}
                  />
                  {formSettings.published && formSettings.publishedUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('registrationForm.publishedUrl')}:
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {formSettings.publishedUrl}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
          </Box>
        </Grid>

        {/* Form Preview */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {t('registrationForm.preview')}
            </Typography>
              <Box sx={{ 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 1, 
                p: 2, 
                boxShadow: 1,
                backgroundColor: 'white'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  {formSettings.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.5 }}>
                  {formSettings.description}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
                      {t('registrationForm.fields.fullName')}
                    </Typography>
                    <TextField size="small" disabled variant="outlined" fullWidth />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
                      {t('common.last_name')}
                    </Typography>
                    <TextField size="small" disabled variant="outlined" fullWidth />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
                      {t('registrationForm.fields.email')}
                    </Typography>
                    <TextField size="small" disabled variant="outlined" fullWidth />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
                      {t('registrationForm.fields.phone')}
                    </Typography>
                    <TextField size="small" disabled variant="outlined" fullWidth />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
                      {t('forms.source')}
                    </Typography>
                    <FormControl size="small" fullWidth variant="outlined">
                      <Select disabled value="website">
                        <MenuItem value="website">{t('sources.website')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Button variant="contained" disabled sx={{ height: 48, mt: 1 }}>
                    {t('landing_pages.forms.submit')}
                  </Button>
                </Box>
              </Box>
          </Box>
        </Grid>
        </Grid>
      </Box>

      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { boxShadow: 6, border: '1px solid', borderColor: 'divider' }
        }}
      >
        <DialogTitle>{t('registrationForm.buttons.preview')}</DialogTitle>
        <DialogContent>
          <FormPreview />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>{t('actions.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog 
        open={publishDialogOpen} 
        onClose={() => setPublishDialogOpen(false)}
        PaperProps={{
          sx: { boxShadow: 6, border: '1px solid', borderColor: 'divider' }
        }}
      >
        <DialogTitle>{t('registrationForm.buttons.publish')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('registrationForm.publishConfirmation')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)} disabled={isPublishing}>
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={handlePublish} 
            variant="contained" 
            disabled={isPublishing}
            startIcon={isPublishing ? <CircularProgress size={20} /> : <PublishIcon />}
            sx={{ 
              backgroundColor: '#7367F0', 
              '&:hover': { backgroundColor: '#5a52cc' },
              '&:disabled': { backgroundColor: '#b8b2ff' }
            }}
          >
            {isPublishing ? t('registrationForm.publishing') : t('registrationForm.buttons.publish')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Create>
  );
};

export default RegistrationForm;