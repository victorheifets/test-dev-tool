import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Participant, ParticipantStatus } from '../../types/participant';

interface ParticipantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (participant: Omit<Participant, 'id'>) => void;
  initialData?: Participant | Omit<Participant, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyParticipant: Omit<Participant, 'id'> = {
  provider_id: '',
  name: '',
  email: '',
  phone: '',
  status: 'active',
  created_at: new Date().toISOString(),
  enrollments_count: 0,
};

export const ParticipantModal: React.FC<ParticipantModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const [participant, setParticipant] = useState<Omit<Participant, 'id'>>(emptyParticipant);

  useEffect(() => {
    if (initialData) {
      const { id, ...data } = initialData as Participant;
      setParticipant(data);
    } else {
      setParticipant(emptyParticipant);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setParticipant(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    onSave(participant);
    onClose();
  };

  const getTitle = () => {
    if (mode === 'edit') return 'Edit Student';
    if (mode === 'duplicate') return 'Duplicate Student';
    return 'Add New Student';
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
            <TextField name="name" label="Name" value={participant.name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label="Email" value={participant.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="phone" label="Phone" value={participant.phone} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={participant.status} onChange={handleChange} label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
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
