import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Lead, LeadSource, LeadStatus } from '../../types/lead';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id'>) => void;
  initialData?: Lead | Omit<Lead, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyLead: Omit<Lead, 'id'> = {
  provider_id: '',
  name: '',
  email: '',
  phone: '',
  source: 'website',
  status: 'new',
  created_at: new Date().toISOString(),
};

export const LeadModal: React.FC<LeadModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const [lead, setLead] = useState<Omit<Lead, 'id'>>(emptyLead);

  useEffect(() => {
    if (initialData) {
      const { id, ...data } = initialData as Lead;
      setLead(data);
    } else {
      setLead(emptyLead);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setLead(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    onSave(lead);
    onClose();
  };

  const getTitle = () => {
    if (mode === 'edit') return 'Edit Lead';
    if (mode === 'duplicate') return 'Duplicate Lead';
    return 'Add New Lead';
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
            <TextField name="name" label="Name" value={lead.name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label="Email" value={lead.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="phone" label="Phone" value={lead.phone} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select name="source" value={lead.source} onChange={handleChange} label="Source">
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={lead.status} onChange={handleChange} label="Status">
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
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