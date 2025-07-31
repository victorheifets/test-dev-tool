import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { LeadSource, LeadStatus } from '../../types/lead';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { UseFormReturn, Controller, FieldErrors } from 'react-hook-form';
import { LeadCreate } from '../../types/generated/validation-schemas';
import { getFormFieldStyles } from '../../styles/formStyles';
import { useList } from '@refinedev/core';
import { Activity } from '../../types/activity';

interface LeadFormProps {
  form: UseFormReturn<LeadCreate>;
  errors: FieldErrors<LeadCreate>;
}

const LEAD_SOURCES = [
  LeadSource.WEBSITE,
  LeadSource.REFERRAL,
  LeadSource.SOCIAL_MEDIA,
  LeadSource.EMAIL,
  LeadSource.ADVERTISEMENT,
  LeadSource.OTHER,
];

const LEAD_STATUSES = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.CONVERTED,
  LeadStatus.LOST,
];

export const LeadForm: React.FC<LeadFormProps> = ({ form, errors }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { register, control } = form;

  // Fetch activities from API
  const { data: activitiesData } = useList<Activity>({
    resource: 'activities',
  });

  const activities = activitiesData?.data || [];

  // Create options for select fields
  const sourceOptions = LEAD_SOURCES.map(source => ({
    value: source,
    label: t(`sources.${source}`, source)
  }));

  const statusOptions = LEAD_STATUSES.map(status => ({
    value: status,
    label: t(`status_options.${status}`, status)
  }));

  const activityOptions = activities.map(activity => ({
    value: activity.id || '',
    label: activity.name
  })).filter(option => option.value !== ''); // Filter out activities without valid IDs

  return (
    <Grid 
      container 
      spacing={isMobile ? 2 : 2} 
      sx={getFormFieldStyles(isMobile)}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          {...register('first_name')}
          label={t('forms.first_name')}
          fullWidth
          required
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
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
      
      <Grid item xs={12} sm={6}>
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.source}>
              <InputLabel>{t('forms.source')}</InputLabel>
              <Select
                {...field}
                label={t('forms.source')}
              >
                {sourceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.source && (
                <FormHelperText>{errors.source.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>{t('course_fields.status')}</InputLabel>
              <Select
                {...field}
                label={t('course_fields.status')}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && (
                <FormHelperText>{errors.status.message}</FormHelperText>
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
            <FormControl fullWidth error={!!errors.activity_of_interest}>
              <InputLabel>{t('forms.activity_of_interest')}</InputLabel>
              <Select
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                label={t('forms.activity_of_interest')}
              >
                <MenuItem value="">
                  <em>{t('forms.select_activity', 'Select an activity')}</em>
                </MenuItem>
                {activityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.activity_of_interest && (
                <FormHelperText>{errors.activity_of_interest.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          {...register('notes')}
          label={t('common.notes', 'Notes')}
          placeholder="Add any notes about this lead..."
          fullWidth
          multiline
          rows={3}
          error={!!errors.notes}
          helperText={errors.notes?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-focused': {
                backgroundColor: 'background.paper',
              }
            }
          }}
        />
      </Grid>
    </Grid>
  );
};