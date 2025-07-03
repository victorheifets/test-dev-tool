import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Participant, ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';

interface ParticipantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (participant: ParticipantCreate) => void;
  initialData?: Participant | null;
  mode: 'create' | 'edit' | 'duplicate';
}

const emptyParticipant: ParticipantCreate = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
};

export const ParticipantModal: React.FC<ParticipantModalProps> = ({ open, onClose, onSave, initialData, mode }) => {
  const { t } = useTranslation();
  const [participant, setParticipant] = useState<ParticipantCreate>(emptyParticipant);

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, ...data } = initialData;
      // Map Participant to ParticipantCreate format
      const participantCreate: ParticipantCreate = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        profile_info: data.profile_info,
        health_declaration: data.health_declaration,
        terms_declaration: data.terms_declaration,
      };
      setParticipant(participantCreate);
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
  };

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('student');
    if (mode === 'duplicate') return t('actions.duplicate', 'Duplicate') + ' ' + t('student');
    return t('actions.create') + ' ' + t('student');
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
          <Grid item xs={6}>
            <TextField name="first_name" label={t('forms.first_name')} value={participant.first_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField name="last_name" label={t('forms.last_name')} value={participant.last_name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label={t('common.email')} value={participant.email} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="phone" label={t('common.phone')} value={participant.phone || ''} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="address" label={t('common.address')} value={participant.address || ''} onChange={handleChange} fullWidth multiline rows={2} />
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
