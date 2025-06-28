import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Course } from '../../data/mockCourses';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id'>) => void;
  initialData?: Course | Omit<Course, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyCourse: Omit<Course, 'id'> = {
  name: '',
  subtext: '',
  status: 'Draft',
  instructor: '',
  location: '',
  startDate: '',
  endDate: '',
  capacity: 0,
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const [course, setCourse] = useState<Omit<Course, 'id'>>(emptyCourse);

  useEffect(() => {
    if (initialData) {
      const { id, ...data } = initialData as Course;
      setCourse(data);
    } else {
      setCourse(emptyCourse);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<"Published" | "Ongoing" | "Draft">) => {
    const { name, value } = event.target;
    setCourse(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    onSave(course);
    onClose();
  };

  const getTitle = () => {
    if (mode === 'edit') return 'Edit Course';
    if (mode === 'duplicate') return 'Duplicate Course';
    return 'Add New Course';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField name="name" label="Class Name" value={course.name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="subtext" label="Subtext" value={course.subtext} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={course.status} onChange={handleChange} label="Status">
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="instructor" label="Instructor" value={course.instructor} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="location" label="Location" value={course.location} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
             <TextField name="capacity" label="Capacity" type="number" value={course.capacity} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="startDate" label="Start Date" value={course.startDate} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="endDate" label="End Date" value={course.endDate} onChange={handleChange} fullWidth />
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