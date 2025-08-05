import React, { useState } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useList } from '@refinedev/core';
import { EnrollmentStatus } from '../../types/enrollment';
import { Activity } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { UseFormReturn, Controller, FieldErrors } from 'react-hook-form';
import { EnrollmentCreate } from '../../types/generated/validation-schemas';
import { getFormFieldStyles } from '../../styles/formStyles';
import { EnrollmentMode } from '../../types/flexibleEnrollment';
import { ParticipantAutocomplete } from '../common/ParticipantAutocomplete';
import { LeadAutocomplete } from '../common/LeadAutocomplete';
import { SimpleParticipantForm } from './SimpleParticipantForm';

interface EnrollmentFormProps {
  form: UseFormReturn<EnrollmentCreate>;
  errors: FieldErrors<EnrollmentCreate>;
  onModeChange?: (mode: EnrollmentMode) => void;
  onParticipantSelect?: (participantId: string | null) => void;
  onLeadSelect?: (leadId: string | null) => void;
  onParticipantData?: (data: any) => void;
}

const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  EnrollmentStatus.PENDING,
  EnrollmentStatus.CONFIRMED,
  EnrollmentStatus.CANCELLED,
  EnrollmentStatus.COMPLETED,
  EnrollmentStatus.WAITLISTED,
  EnrollmentStatus.NO_SHOW
];

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ 
  form, 
  errors, 
  onModeChange,
  onParticipantSelect,
  onLeadSelect,
  onParticipantData 
}) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { register, control, watch, setValue } = form;
  
  // State for enrollment mode
  const [enrollmentMode, setEnrollmentMode] = useState<EnrollmentMode>('existing');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [participantData, setParticipantData] = useState<any>(null);
  
  // Handle mode change
  const handleModeChange = (newMode: EnrollmentMode | null) => {
    if (newMode) {
      setEnrollmentMode(newMode);
      // Clear selections when changing mode
      setSelectedParticipantId(null);
      setSelectedLeadId(null);
      setParticipantData(null);
      // Clear form participant_id
      setValue('participant_id', '');
      // Notify parent
      onModeChange?.(newMode);
    }
  };

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

  // Create options for select fields
  const statusOptions = ENROLLMENT_STATUSES.map(status => ({
    value: status,
    label: t(`status_options.${status}`, status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '))
  }));

  const activityOptions = activeActivities.map(activity => ({
    value: activity.id || '',
    label: activity.name
  }));

  return (
    <Grid 
      container 
      spacing={isMobile ? 2 : 2} 
      sx={getFormFieldStyles(isMobile)}
    >
      {/* Enrollment Mode Selection */}
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('forms.enrollment_mode')}
          </Typography>
          <ToggleButtonGroup
            value={enrollmentMode}
            exclusive
            onChange={(_, value) => handleModeChange(value)}
            size="small"
            fullWidth={isMobile}
            sx={{ display: 'flex', flexWrap: isMobile ? 'wrap' : 'nowrap' }}
          >
            <ToggleButton value="existing" sx={{ flex: 1, minWidth: 'auto' }}>
              {t('forms.existing_participant')}
            </ToggleButton>
            <ToggleButton value="new" sx={{ flex: 1, minWidth: 'auto' }}>
              {t('forms.new_participant')}
            </ToggleButton>
            <ToggleButton value="from_lead" sx={{ flex: 1, minWidth: 'auto' }}>
              {t('forms.from_lead')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>

      {/* Participant Selection based on mode */}
      <Grid item xs={12}>
        {enrollmentMode === 'existing' && (
          <ParticipantAutocomplete
            value={selectedParticipantId}
            onChange={(participantId) => {
              setSelectedParticipantId(participantId);
              setValue('participant_id', participantId || '');
              onParticipantSelect?.(participantId);
            }}
            error={!!errors.participant_id}
            helperText={errors.participant_id?.message}
            placeholder={t('search.select_participant')}
          />
        )}
        
        {enrollmentMode === 'from_lead' && (
          <LeadAutocomplete
            value={selectedLeadId}
            onChange={(leadId) => {
              setSelectedLeadId(leadId);
              onLeadSelect?.(leadId);
            }}
            placeholder={t('search.select_lead')}
          />
        )}
        
        {enrollmentMode === 'new' && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              {t('forms.new_participant_details')}
            </Typography>
            <SimpleParticipantForm
              onDataChange={(data) => {
                setParticipantData(data);
                onParticipantData?.(data);
              }}
              compact={true}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="activity_id"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth required error={!!errors.activity_id}>
              <InputLabel>{t('course')}</InputLabel>
              <Select
                {...field}
                label={t('course')}
              >
                {activityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.activity_id && (
                <FormHelperText>{errors.activity_id.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>{t('course_fields.status')}</InputLabel>
              <Select
                {...field}
                label={t('course_fields.status')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
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
        <TextField
          {...register('notes')}
          label={t('forms.notes')}
          placeholder={t('forms.enrollment_notes_placeholder')}
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