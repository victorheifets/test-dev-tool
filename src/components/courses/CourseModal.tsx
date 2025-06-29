import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Activity, ActivityCreate } from '../../types/activity';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (activity: ActivityCreate) => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyActivity: ActivityCreate = {
  name: '',
  description: '',
  status: 'draft',
  location: '',
  start_date: '',
  end_date: '',
  capacity: 50,
  category: '',
  pricing: { amount: 0, currency: 'USD' },
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const [activity, setActivity] = useState<ActivityCreate>(emptyActivity);

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
    setActivity(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(activity);
    }
    onClose();
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
            <TextField name="start_date" label="Start Date" type="date" value={activity.start_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="end_date" label="End Date" type="date" value={activity.end_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}; 