import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { Activity, ActivityStatus, ActivityType, ActivityCreate } from '../../types/activity';
import { useTranslation } from 'react-i18next';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: ActivityCreate) => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const ACTIVITY_STATUSES: ActivityStatus[] = ['draft', 'published', 'ongoing', 'completed', 'cancelled'];
const ACTIVITY_TYPES: ActivityType[] = ['course', 'workshop', 'seminar', 'webinar', 'other'];

const emptyActivity: ActivityCreate = {
  name: '',
  description: null,
  capacity: null,
  start_date: null,
  end_date: null,
  location: null,
  activity_type: 'course' as ActivityType,
  status: 'draft' as ActivityStatus,
  price: null,
  currency: 'USD',
  category: null,
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const { t } = useTranslation();
  const [activity, setActivity] = useState<ActivityCreate>(emptyActivity);

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, available_spots, is_fully_booked, ...data } = initialData;
      // Map Activity to ActivityCreate format
      const activityCreate: ActivityCreate = {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        activity_type: data.activity_type,
        status: data.status,
        price: data.price,
        currency: data.currency,
        category: data.category,
      };
      setActivity(activityCreate);
    } else {
      setActivity(emptyActivity);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (typeof onSave !== 'function') {
      console.error('onSave is not a function');
      return;
    }
    
    // onSave now handles the async operation and modal closing
    onSave(activity);
  };

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('course');
    if (mode === 'duplicate') return t('actions.duplicate', 'Duplicate') + ' ' + t('course');
    return t('actions.create') + ' ' + t('course');
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
        <form id="course-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Grid container spacing={2} sx={(theme) => ({
            mt: 1,
            direction: theme.direction,
            '& .MuiTextField-root': {
              '& .MuiInputLabel-root': {
                transformOrigin: theme.direction === 'rtl' ? 'top right' : 'top left',
              }
            }
          })}>
            <Grid item xs={12} sm={8}>
              <TextField 
                name="name" 
                label={t('course_fields.name')} 
                value={activity.name} 
                onChange={handleChange} 
                fullWidth 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>{t('forms.type')}</InputLabel>
                <Select 
                  name="activity_type" 
                  value={activity.activity_type} 
                  onChange={handleChange} 
                  label={t('forms.type')}
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`activity_types.${type}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                name="description" 
                label={t('course_fields.description')} 
                value={activity.description || ''} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={3} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('course_fields.status')}</InputLabel>
                <Select 
                  name="status" 
                  value={activity.status} 
                  onChange={handleChange} 
                  label={t('course_fields.status')}
                >
                  {ACTIVITY_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`course_status.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="location" 
                label={t('course_fields.location')} 
                value={activity.location || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="capacity" 
                label={t('course_fields.capacity')} 
                type="number" 
                value={activity.capacity || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="start_date" 
                label={t('course_fields.start_date')} 
                type="date" 
                value={activity.start_date || ''} 
                onChange={handleChange} 
                fullWidth
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="end_date" 
                label={t('course_fields.end_date')} 
                type="date" 
                value={activity.end_date || ''} 
                onChange={handleChange} 
                fullWidth
                InputLabelProps={{ shrink: true }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="price" 
                label={t('course_fields.price')} 
                type="number" 
                value={activity.price || ''} 
                onChange={handleChange} 
                fullWidth
                InputProps={{
                  startAdornment: activity.currency || 'USD'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="category" 
                label={t('course_fields.category')} 
                value={activity.category || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button 
          type="submit" 
          form="course-form" 
          variant="contained"
        >
          {t('actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
