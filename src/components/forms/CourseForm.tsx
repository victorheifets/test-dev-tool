import React from 'react';
import { Grid } from '@mui/material';
import { ActivityStatus, ActivityType } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';

// Import validation components
import { ValidatedTextField, ValidatedSelect, ValidatedDatePicker } from '../common/validated';
import { ActivityCreateSchema } from '../../types/generated';

interface CourseFormProps {
  validatedFormHook: any; // Required validation hook from parent modal
}

const ACTIVITY_STATUSES: ActivityStatus[] = [
  ActivityStatus.DRAFT, 
  ActivityStatus.PUBLISHED, 
  ActivityStatus.ONGOING, 
  ActivityStatus.COMPLETED, 
  ActivityStatus.CANCELLED
];

const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.COURSE, 
  ActivityType.WORKSHOP, 
  ActivityType.SEMINAR, 
  ActivityType.WEBINAR, 
  ActivityType.OTHER
];

export const CourseForm: React.FC<CourseFormProps> = ({ 
  validatedFormHook
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  // Get current form data for dependent logic
  const formData = validatedFormHook.watch();

  // Create options for select fields
  const activityTypeOptions = ACTIVITY_TYPES.map(type => ({
    value: type,
    label: t(`activity_types.${type}`)
  }));

  const statusOptions = ACTIVITY_STATUSES.map(status => ({
    value: status,
    label: t(`course_status.${status}`)
  }));

  return (
    <Grid 
      container 
      spacing={isMobile ? 3 : 2.5} 
      sx={(theme) => ({
        mt: isMobile ? 0.5 : 0.5,
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
      <Grid item xs={12} sm={8}>
        <ValidatedTextField
          {...validatedFormHook.createField('name')}
          label={t('course_fields.name')}
          required
        />
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <ValidatedSelect
          {...validatedFormHook.createField('type')}
          label={t('forms.type')}
          options={activityTypeOptions}
          required
        />
      </Grid>
      
      <Grid item xs={12}>
        <ValidatedTextField
          {...validatedFormHook.createField('description')}
          label={t('course_fields.description')}
          multiline
          rows={3}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedSelect
          {...validatedFormHook.createField('status')}
          label={t('course_fields.status')}
          options={statusOptions}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedTextField
          {...validatedFormHook.createField('location')}
          label={t('course_fields.location')}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedTextField
          {...validatedFormHook.createField('capacity')}
          label={t('course_fields.capacity')}
          type="number"
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedDatePicker
          {...validatedFormHook.createField('start_date')}
          label={t('course_fields.start_date')}
          slotProps={{
            textField: {
              inputProps: { 
                style: { fontSize: isMobile ? '16px' : '14px' }
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? 2 : 1.5,
                },
              }
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedDatePicker
          {...validatedFormHook.createField('end_date')}
          label={t('course_fields.end_date')}
          minDate={formData.start_date ? new Date(formData.start_date) : undefined}
          slotProps={{
            textField: {
              inputProps: { 
                style: { fontSize: isMobile ? '16px' : '14px' }
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: isMobile ? 2 : 1.5,
                },
              }
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedTextField
          {...validatedFormHook.createField('price')}
          label={t('course_fields.price')}
          type="number"
          InputProps={{
            startAdornment: formData.currency || 'USD'
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <ValidatedTextField
          {...validatedFormHook.createField('category')}
          label={t('course_fields.category')}
        />
      </Grid>
    </Grid>
  );
};