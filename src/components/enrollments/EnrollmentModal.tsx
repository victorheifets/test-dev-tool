import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Enrollment, EnrollmentStatus, PaymentStatus } from '../../types/enrollment';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (enrollment: Omit<Enrollment, 'id'>) => void;
  initialData?: Enrollment | Omit<Enrollment, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyEnrollment: Omit<Enrollment, 'id'> = {
  provider_id: '',
  participant_id: '',
  participant_name: '',
  activity_id: '',
  activity_name: '',
  status: 'enrolled',
  enrollment_date: new Date().toISOString().split('T')[0],
  payment_status: 'pending',
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const [enrollment, setEnrollment] = useState<Omit<Enrollment, 'id'>>(emptyEnrollment);

  useEffect(() => {
    if (initialData) {
      const { id, ...data } = initialData as Enrollment;
      setEnrollment(data);
    } else {
      setEnrollment(emptyEnrollment);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEnrollment(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    onSave(enrollment);
    onClose();
  };

  const getTitle = () => {
    if (mode === 'edit') return 'Edit Enrollment';
    if (mode === 'duplicate') return 'Duplicate Enrollment';
    return 'Add New Enrollment';
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
            <TextField name="participant_name" label="Student Name" value={enrollment.participant_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="activity_name" label="Course Name" value={enrollment.activity_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={enrollment.status} onChange={handleChange} label="Status">
                <MenuItem value="enrolled">Enrolled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select name="payment_status" value={enrollment.payment_status} onChange={handleChange} label="Payment Status">
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="enrollment_date" 
              label="Enrollment Date" 
              type="date" 
              value={enrollment.enrollment_date} 
              onChange={handleChange} 
              fullWidth 
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="completion_date" 
              label="Completion Date" 
              type="date" 
              value={enrollment.completion_date || ''} 
              onChange={handleChange} 
              fullWidth 
              InputLabelProps={{ shrink: true }}
            />
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