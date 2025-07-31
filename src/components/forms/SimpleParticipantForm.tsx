import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { ParticipantCreate } from '../../types/participant';

interface SimpleParticipantFormProps {
  onDataChange: (data: ParticipantCreate | null) => void;
  compact?: boolean;
  initialData?: Partial<ParticipantCreate>;
}

export const SimpleParticipantForm: React.FC<SimpleParticipantFormProps> = ({
  onDataChange,
  compact = false,
  initialData = {}
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  
  const [formData, setFormData] = useState<Partial<ParticipantCreate>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate form and notify parent
  useEffect(() => {
    const validateAndNotify = () => {
      const newErrors: Record<string, string> = {};
      
      // Required field validation - only show errors for touched fields
      if (touched.first_name && !formData.first_name?.trim()) {
        newErrors.first_name = t('validation.required_field');
      }
      if (touched.last_name && !formData.last_name?.trim()) {
        newErrors.last_name = t('validation.required_field');
      }
      if (touched.email && !formData.email?.trim()) {
        newErrors.email = t('validation.required_field');
      } else if (touched.email && formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('validation.invalid_email');
      }

      setErrors(newErrors);

      // If no validation errors and required fields are filled, notify parent with data
      const hasValidationErrors = Object.keys(newErrors).length > 0;
      const hasRequiredFields = formData.first_name?.trim() && 
                               formData.last_name?.trim() && 
                               formData.email?.trim();
      
      if (!hasValidationErrors && hasRequiredFields) {
        onDataChange(formData as ParticipantCreate);
      } else {
        onDataChange(null);
      }
    };

    validateAndNotify();
  }, [formData, onDataChange, t, touched]);

  const handleChange = (field: keyof ParticipantCreate) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleBlur = (field: keyof ParticipantCreate) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const spacing = compact ? 1 : (isMobile ? 2 : 2);

  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t('forms.first_name')}
          value={formData.first_name || ''}
          onChange={handleChange('first_name')}
          onBlur={handleBlur('first_name')}
          fullWidth
          required
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          label={t('forms.last_name')}
          value={formData.last_name || ''}
          onChange={handleChange('last_name')}
          onBlur={handleBlur('last_name')}
          fullWidth
          required
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          label={t('forms.email')}
          type="email"
          value={formData.email || ''}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          label={t('forms.phone')}
          value={formData.phone || ''}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
    </Grid>
  );
};