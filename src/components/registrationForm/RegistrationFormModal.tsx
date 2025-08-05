import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { CommonModalShell } from '../common/CommonModalShell';
import { RegistrationForm, RegistrationFormCreate } from '../../types/registration-form';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface RegistrationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: RegistrationFormCreate) => void;
  forceMobile?: boolean;
  initialData?: RegistrationForm | null;
  mode: 'create' | 'edit' | 'duplicate';
}

interface FormData {
  title: string;
  description: string;
  is_active: boolean;
}

export const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({
  open,
  onClose,
  onSave,
  forceMobile = false,
  initialData,
  mode
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create validation schema
  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .required(t('validation.title_required'))
      .min(1, t('validation.title_min_length'))
      .max(200, t('validation.title_max_length')),
    description: yup
      .string()
      .required(t('validation.description_required'))
      .min(1, t('validation.description_min_length'))
      .max(1000, t('validation.description_max_length')),
    is_active: yup.boolean().required(),
  });

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      description: '',
      is_active: true,
    }
  });

  // Update form when initial data changes
  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'duplicate')) {
      setValue('title', mode === 'duplicate' ? `${initialData.title} (Copy)` : initialData.title);
      setValue('description', initialData.description);
      setValue('is_active', initialData.is_active);
    } else {
      // Reset to defaults for create mode
      reset({
        title: '',
        description: '',
        is_active: true,
      });
    }
  }, [initialData, mode, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    console.log('[RegistrationFormModal] onSubmit called with data:', data);
    setIsSubmitting(true);
    try {
      const formData: RegistrationFormCreate = {
        title: data.title.trim(),
        description: data.description.trim(),
        is_active: data.is_active,
      };
      
      console.log('[RegistrationFormModal] Calling onSave with formData:', formData);
      onSave(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false); // Reset submitting state on error
    }
    // Note: setIsSubmitting(false) is handled by parent component on success/error
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return t('registrationForm.createForm');
      case 'edit':
        return t('registrationForm.editForm');
      case 'duplicate':
        return t('registrationForm.duplicateForm');
      default:
        return t('registrationForm.createForm');
    }
  };

  const getSaveButtonText = () => {
    if (isSubmitting) {
      return mode === 'edit' ? t('actions.updating') : t('actions.creating');
    }
    return mode === 'edit' ? t('actions.update') : t('actions.create');
  };

  return (
    <CommonModalShell
      open={open}
      onClose={handleClose}
      title={getModalTitle()}
      forceMobile={forceMobile || isMobile}
      maxWidth="md"
      fullScreen={isMobile}
      showActions={true}
      onCancel={handleClose}
      onSave={handleSubmit(onSubmit)}
      cancelButtonText={t('actions.cancel')}
      saveButtonText={getSaveButtonText()}
      saveButtonDisabled={isSubmitting}
      saveButtonStartIcon={isSubmitting ? <CircularProgress size={20} /> : undefined}
    >
      <Box sx={{ mt: 2, minHeight: 300 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('registrationForm.title')}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  size={isMobile ? 'small' : 'medium'}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('registrationForm.description')}
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  size={isMobile ? 'small' : 'medium'}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Publish/Unpublish Status Switch */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: 'divider' 
            }}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        size={isMobile ? 'small' : 'medium'}
                        color={field.value ? 'success' : 'default'}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {field.value ? t('registrationForm.published') : t('registrationForm.draft')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {field.value 
                            ? t('registrationForm.publishedDescription')
                            : t('registrationForm.draftDescription')
                          }
                        </Typography>
                      </Box>
                    }
                  />
                )}
              />
            </Box>

            {/* Form URL Preview for Edit Mode */}
            {mode === 'edit' && initialData?.form_url && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'grey.50', 
                borderRadius: 1, 
                border: '1px solid', 
                borderColor: 'divider' 
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('registrationForm.publicUrl')}:
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
                  {initialData.form_url.startsWith('http') 
                    ? initialData.form_url 
                    : `${window.location.origin}${initialData.form_url}`
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </form>
      </Box>
    </CommonModalShell>
  );
};