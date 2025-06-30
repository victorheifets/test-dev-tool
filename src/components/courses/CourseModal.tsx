import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useCreate, useUpdate } from '@refinedev/core';
import { Activity, ActivityCreate } from '../../types/activity';
import { useErrorHandler } from '../../hooks/useErrorHandler';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyActivity: ActivityCreate = {
  name: '',
  description: '',
  status: 'draft',
  location: '',
  start_date: new Date().toISOString().split('T')[0], // Today's date as default
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  capacity: 50,
  category: '',
  pricing: { amount: 0, currency: 'USD' },
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, initialData, mode }) => {
  const [activity, setActivity] = useState<ActivityCreate>(emptyActivity);
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleError, showSuccess } = useErrorHandler();
  const { mutate: createActivity } = useCreate();
  const { mutate: updateActivity } = useUpdate();

  useEffect(() => {
    if (initialData) {
      // Convert Activity to ActivityCreate format
      const activityData: ActivityCreate = {
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
        location: initialData.location,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        capacity: initialData.capacity,
        category: initialData.category,
        pricing: initialData.pricing,
      };
      setActivity(activityData);
    } else {
      setActivity(emptyActivity);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    
    // Handle pricing fields specially
    if (name === 'price') {
      setActivity(prev => ({ 
        ...prev, 
        pricing: { 
          ...prev.pricing, 
          amount: Number(value) || 0 
        }
      }));
    } else {
      setActivity(prev => ({ ...prev, [name as string]: value }));
    }
  };

  const handleSave = () => {
    console.log('CourseModal handleSave called, mode:', mode, 'data:', activity);
    setIsLoading(true);
    
    if (mode === 'create' || mode === 'duplicate') {
      console.log('Creating/duplicating activity');
      createActivity({
        resource: 'courses',
        values: activity,
      }, {
        onSuccess: () => {
          showSuccess('Course created successfully!');
          onClose();
          setActivity(emptyActivity);
        },
        onError: (error) => {
          handleError(error, 'Create Course');
        },
        onSettled: () => {
          setIsLoading(false);
        }
      });
    } else if (mode === 'edit' && initialData) {
      updateActivity({
        resource: 'courses',
        id: initialData.id,
        values: activity,
      }, {
        onSuccess: () => {
          showSuccess('Course updated successfully!');
          onClose();
        },
        onError: (error) => {
          handleError(error, 'Update Course');
        },
        onSettled: () => {
          setIsLoading(false);
        }
      });
    }
  };

  const getTitle = () => {
    if (mode === 'edit') return 'Edit Course';
    if (mode === 'duplicate') return 'Duplicate Course';
    return 'Add New Course';
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField name="name" label="Course Name" value={activity.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="description" label="Description" value={activity.description} onChange={handleChange} fullWidth multiline rows={3} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="category" label="Category" value={activity.category} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={activity.status} onChange={handleChange} label="Status">
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="location" label="Location" value={activity.location} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="capacity" label="Capacity" type="number" value={activity.capacity} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="price" label="Price (USD)" type="number" value={activity.pricing.amount} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="start_date" label="Start Date" type="date" value={activity.start_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="end_date" label="End Date" type="date" value={activity.end_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" form="course-form" variant="contained" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 