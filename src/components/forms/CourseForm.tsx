import React from 'react';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ActivityStatus, ActivityType } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { UseFormReturn, Controller, FieldErrors } from 'react-hook-form';
import { ActivityCreate } from '../../types/generated/validation-schemas';

interface CourseFormProps {
  form: UseFormReturn<ActivityCreate>;
  errors: FieldErrors<ActivityCreate>;
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

export const CourseForm: React.FC<CourseFormProps> = ({ form, errors }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { register, control, watch } = form;
  
  const formValues = watch();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid 
        container 
        spacing={isMobile ? 2 : 2} 
        sx={{
          mt: 0,
          '& .MuiTextField-root, & .MuiFormControl-root': {
            '& .MuiOutlinedInput-root': {
              borderRadius: isMobile ? 2 : 1.5,
            },
            '& .MuiInputBase-input': {
              fontSize: isMobile ? '16px' : '14px',
            },
          },
        }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('name')}
            label={t('course_fields.name')}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.type}>
                <InputLabel>{t('forms.type')}</InputLabel>
                <Select
                  {...field}
                  label={t('forms.type')}
                >
                  {ACTIVITY_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {t(`activity_types.${type}`)}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText>{errors.type.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            {...register('description')}
            label={t('course_fields.description')}
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
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
                  {ACTIVITY_STATUSES.map(status => (
                    <MenuItem key={status} value={status}>
                      {t(`course_status.${status}`)}
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
        
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('location')}
            label={t('course_fields.location')}
            fullWidth
            error={!!errors.location}
            helperText={errors.location?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t('course_fields.start_date')}
                value={field.value ? new Date(field.value) : null}
                format="dd/MM/yyyy"
                closeOnSelect
                onChange={(date) => {
                  const formattedDate = date ? date.toISOString().split('T')[0] : '';
                  field.onChange(formattedDate);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.start_date,
                    helperText: errors.start_date?.message,
                    inputProps: { 
                      style: { fontSize: isMobile ? '16px' : '14px' },
                      placeholder: 'DD/MM/YYYY'
                    },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: isMobile ? 2 : 1.5,
                      },
                    }
                  },
                  popper: {
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'offset',
                        options: { offset: [0, 4] }
                      }
                    ]
                  }
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t('course_fields.end_date')}
                value={field.value ? new Date(field.value) : null}
                format="dd/MM/yyyy"
                closeOnSelect
                onChange={(date) => {
                  const formattedDate = date ? date.toISOString().split('T')[0] : '';
                  field.onChange(formattedDate);
                }}
                minDate={formValues.start_date ? new Date(formValues.start_date) : undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.end_date,
                    helperText: errors.end_date?.message,
                    inputProps: { 
                      style: { fontSize: isMobile ? '16px' : '14px' },
                      placeholder: 'DD/MM/YYYY'
                    },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: isMobile ? 2 : 1.5,
                      },
                    }
                  },
                  popper: {
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'offset',
                        options: { offset: [0, 4] }
                      }
                    ]
                  }
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('capacity', { valueAsNumber: true })}
            label={t('course_fields.capacity')}
            fullWidth
            type="number"
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('price', { valueAsNumber: true })}
            label={t('course_fields.price')}
            fullWidth
            type="number"
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            {...register('category')}
            label={t('course_fields.category')}
            fullWidth
            error={!!errors.category}
            helperText={errors.category?.message}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};