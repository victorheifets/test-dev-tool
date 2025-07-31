import React from 'react';
import { Grid, TextField } from '@mui/material';
import { ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import { getFormFieldStyles } from '../../styles/formStyles';

interface ParticipantFormProps {
  form: UseFormReturn<ParticipantCreate>;
  errors: FieldErrors<ParticipantCreate>;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ form, errors }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { register } = form;

  return (
    <Grid 
      container 
      spacing={isMobile ? 2 : 2} 
      sx={getFormFieldStyles(isMobile)}
    >
      <Grid item xs={6}>
        <TextField
          {...register('first_name')}
          label={t('forms.first_name')}
          fullWidth
          required
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...register('last_name')}
          label={t('forms.last_name')}
          fullWidth
          required
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register('email')}
          label={t('common.email')}
          fullWidth
          type="email"
          required
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register('phone')}
          label={t('common.phone')}
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register('date_of_birth')}
          label={t('forms.date_of_birth')}
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          error={!!errors.date_of_birth}
          helperText={errors.date_of_birth?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          {...register('address')}
          label={t('common.address')}
          fullWidth
          multiline
          rows={2}
          error={!!errors.address}
          helperText={errors.address?.message}
        />
      </Grid>
    </Grid>
  );
};