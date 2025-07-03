import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Lead, LeadSource, LeadStatus } from '../../types/lead';
import { useTranslation } from 'react-i18next';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id'>) => void;
  initialData?: Lead | Omit<Lead, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyLead: Omit<Lead, 'id'> = {
  provider_id: '12345678-1234-5678-1234-567812345678',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  source: 'website',
  status: 'new',
  created_at: new Date().toISOString(),
};

export const LeadModal: React.FC<LeadModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const { t } = useTranslation();
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
    if (mode === 'edit') return t('actions.edit') + ' ' + t('lead');
    if (mode === 'duplicate') return t('actions.duplicate') + ' ' + t('lead');
    return t('actions.create') + ' ' + t('lead');
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
          <Grid item xs={12} sm={6}>
            <TextField name="first_name" label={t('forms.first_name')} value={lead.first_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="last_name" label={t('forms.last_name')} value={lead.last_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label={t('common.email')} value={lead.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="phone" label={t('common.phone')} value={lead.phone} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('forms.source')}</InputLabel>
              <Select name="source" value={lead.source} onChange={handleChange} label={t('forms.source')}>
                <MenuItem value="website">{t('sources.website')}</MenuItem>
                <MenuItem value="referral">{t('sources.referral')}</MenuItem>
                <MenuItem value="social_media">{t('sources.social_media')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('course_fields.status')}</InputLabel>
              <Select name="status" value={lead.status} onChange={handleChange} label={t('course_fields.status')}>
                <MenuItem value="new">{t('status_options.new')}</MenuItem>
                <MenuItem value="contacted">{t('status_options.contacted')}</MenuItem>
                <MenuItem value="qualified">{t('status_options.qualified')}</MenuItem>
                <MenuItem value="converted">{t('status_options.converted')}</MenuItem>
              </Select>
            </FormControl>
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