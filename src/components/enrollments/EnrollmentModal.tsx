import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useList } from '@refinedev/core';
import { Enrollment, EnrollmentStatus, EnrollmentCreate } from '../../types/enrollment';
import { Activity } from '../../types/activity';
import { getProviderId } from '../../config/provider';
import { useTranslation } from 'react-i18next';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (enrollment: EnrollmentCreate) => void;
  initialData?: Enrollment | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const ENROLLMENT_STATUSES: EnrollmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed', 'waitlisted', 'no_show'];

const emptyEnrollment: EnrollmentCreate = {
  participant_id: '',
  activity_id: '',
  status: 'pending',
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const { t } = useTranslation();
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
        attended_sessions: data.attended_sessions,
        payment_info: data.payment_info,
        special_requirements: data.special_requirements,
        discount_code: data.discount_code,
        referral_source: data.referral_source,
      };
      setEnrollment(enrollmentCreate);
    } else {
      setEnrollment(emptyEnrollment);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    
    if (name === 'payment_status') {
      setEnrollment(prev => ({ 
        ...prev, 
        payment_info: {
          ...prev.payment_info || { amount_paid: 0, is_refunded: false, payment_status: 'unpaid' },
          payment_status: value as any
        }
      }));
    } else {
      setEnrollment(prev => ({ ...prev, [name as string]: value }));
    }
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
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={(theme) => ({
          mt: 1,
          direction: theme.direction,
          '& .MuiTextField-root': {
            '& .MuiInputLabel-root': {
              transformOrigin: theme.direction === 'rtl' ? 'top right' : 'top left',
            }
          }
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
              <Select name="status" value={enrollment.status || 'pending'} onChange={handleChange} label={t('course_fields.status')}>
                {ENROLLMENT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t('status_options.' + status, status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '))}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('forms.payment_status')}</InputLabel>
              <Select name="payment_status" value={enrollment.payment_info?.payment_status || 'unpaid'} onChange={handleChange} label={t('forms.payment_status')}>
                <MenuItem value="unpaid">{t('payment_status.unpaid')}</MenuItem>
                <MenuItem value="partial">{t('payment_status.partial')}</MenuItem>
                <MenuItem value="paid">{t('payment_status.paid')}</MenuItem>
                <MenuItem value="refunded">{t('payment_status.refunded')}</MenuItem>
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
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button onClick={handleSave} variant="contained">{t('actions.save')}</Button>
      </DialogActions>
    </Dialog>
  );
}; 