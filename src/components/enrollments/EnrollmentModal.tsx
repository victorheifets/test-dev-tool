import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, useMediaQuery, useTheme, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useList } from '@refinedev/core';
import { Enrollment, EnrollmentStatus, EnrollmentCreate } from '../../types/enrollment';
import { Activity } from '../../types/activity';
import { getProviderId } from '../../config/provider';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (enrollment: EnrollmentCreate) => void;
  initialData?: Enrollment | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  EnrollmentStatus.PENDING,
  EnrollmentStatus.CONFIRMED,
  EnrollmentStatus.CANCELLED,
  EnrollmentStatus.COMPLETED,
  EnrollmentStatus.WAITLISTED,
  EnrollmentStatus.NO_SHOW
];

const emptyEnrollment: EnrollmentCreate = {
  participant_id: '',
  activity_id: '',
  status: EnrollmentStatus.PENDING,
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobileDetected = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = forceMobile !== undefined ? forceMobile : isMobileDetected;
  const [enrollment, setEnrollment] = useState<EnrollmentCreate>(emptyEnrollment);
  
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

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, enrollment_date, completion_percentage, days_remaining, is_active, ...data } = initialData;
      // Map Enrollment to EnrollmentCreate format
      const enrollmentCreate: EnrollmentCreate = {
        participant_id: data.participant_id,
        activity_id: data.activity_id,
        status: data.status,
        notes: data.notes,
        special_requirements: data.special_requirements,
      };
      setEnrollment(enrollmentCreate);
    } else {
      setEnrollment(emptyEnrollment);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEnrollment(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    // Only send data that's actually filled
    const enrollmentToSave: EnrollmentCreate = {
      ...enrollment,
      participant_id: enrollment.participant_id || `participant_${Date.now()}`,
    };
    onSave(enrollmentToSave);
  };

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('enrollment');
    if (mode === 'duplicate') return t('actions.duplicate') + ' ' + t('enrollment');
    return t('actions.create') + ' ' + t('enrollment');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isMobile ? false : "sm"} 
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
          margin: isMobile ? 0 : 3,
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: isMobile ? 'primary.main' : 'transparent',
        color: isMobile ? 'white' : 'text.primary',
        fontWeight: 600,
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        py: isMobile ? 2 : 1.5,
        borderBottom: '1px solid #e0e0e0',
      }}>{getTitle()}</DialogTitle>
      <DialogContent sx={{
        backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 2,
        maxHeight: isMobile ? 'none' : '70vh',
        overflow: 'auto',
      }}>
        <Grid container spacing={isMobile ? 3 : 2} sx={(theme) => ({
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
        })}>
          <Grid item xs={12}>
            <TextField name="participant_id" label={t('forms.participant_id')} value={enrollment.participant_id} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t('course')}</InputLabel>
              <Select 
                name="activity_id" 
                value={enrollment.activity_id} 
                onChange={handleChange} 
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
              <Select name="status" value={enrollment.status || EnrollmentStatus.PENDING} onChange={handleChange} label={t('course_fields.status')}>
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
              value={enrollment.notes || ''} 
              onChange={handleChange} 
              fullWidth 
              multiline 
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="special_requirements" 
              label={t('forms.special_requirements')} 
              value={enrollment.special_requirements || ''} 
              onChange={handleChange} 
              fullWidth 
              multiline 
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{
        backgroundColor: isMobile ? 'background.paper' : 'transparent',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 1,
        gap: 1,
        borderTop: isMobile ? '1px solid' : 'none',
        borderColor: 'divider',
        flexDirection: isMobile ? 'column-reverse' : 'row',
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 