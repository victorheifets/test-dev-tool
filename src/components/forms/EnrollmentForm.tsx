import React from 'react';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useList } from '@refinedev/core';
import { EnrollmentCreate, EnrollmentStatus } from '../../types/enrollment';
import { Activity } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface EnrollmentFormProps {
  data: EnrollmentCreate;
  onChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => void;
}

const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  EnrollmentStatus.PENDING,
  EnrollmentStatus.CONFIRMED,
  EnrollmentStatus.CANCELLED,
  EnrollmentStatus.COMPLETED,
  EnrollmentStatus.WAITLISTED,
  EnrollmentStatus.NO_SHOW
];

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  // Fetch active activities for dropdown
  const { data: activitiesData } = useList<Activity>({
    resource: 'activities',
    filters: [
      {
        field: 'status',
        operator: 'nin',
        value: ['completed', 'cancelled', 'archived']
      }
    ]
  });
  
  const activeActivities = activitiesData?.data || [];

  return (
    <Grid 
      container 
      spacing={isMobile ? 3 : 2} 
      sx={(theme) => ({
        mt: isMobile ? 0.5 : 1,
        direction: theme.direction,
        '& .MuiTextField-root': {
          '& .MuiInputLabel-root': {
            transformOrigin: theme.direction === 'rtl' ? 'top right' : 'top left',
          },
          '& .MuiInputBase-input': {
            fontSize: isMobile ? '16px' : '14px',
            py: isMobile ? 1.5 : 1.2,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: isMobile ? 2 : 1.5,
          },
        },
        '& .MuiFormControl-root': {
          '& .MuiInputBase-root': {
            fontSize: isMobile ? '16px' : '14px',
            borderRadius: isMobile ? 2 : 1.5,
          },
        },
      })}
    >
      <Grid item xs={12}>
        <TextField 
          name="participant_id" 
          label={t('forms.participant_id')} 
          value={data.participant_id} 
          onChange={onChange} 
          fullWidth 
          required
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth required>
          <InputLabel>{t('course')}</InputLabel>
          <Select 
            name="activity_id" 
            value={data.activity_id} 
            onChange={onChange} 
            label={t('course')}
          >
            {activeActivities.map((activity) => (
              <MenuItem key={activity.id} value={activity.id}>
                {activity.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>{t('course_fields.status')}</InputLabel>
          <Select 
            name="status" 
            value={data.status || EnrollmentStatus.PENDING} 
            onChange={onChange} 
            label={t('course_fields.status')}
          >
            {ENROLLMENT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {t('status_options.' + status, status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField 
          name="notes" 
          label={t('forms.notes')} 
          value={data.notes || ''} 
          onChange={onChange} 
          fullWidth 
          multiline 
          rows={2}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          name="special_requirements" 
          label={t('forms.special_requirements')} 
          value={data.special_requirements || ''} 
          onChange={onChange} 
          fullWidth 
          multiline 
          rows={2}
        />
      </Grid>
    </Grid>
  );
};