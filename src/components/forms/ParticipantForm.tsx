import React from 'react';
import { TextField, Grid, SelectChangeEvent } from '@mui/material';
import { ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ParticipantFormProps {
  data: ParticipantCreate;
  onChange: (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => void;
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();

  return (
    <Grid 
      container 
      spacing={isMobile ? 3 : 2} 
      sx={(theme) => ({
        mt: isMobile ? 0.5 : 1,
        direction: theme.direction,
        '& .MuiTextField-root': {
          '& .MuiInputLabel-root': {
            transformOrigin: theme.direction === 'rtl' ? 'top right' : 'top left',
          },
          '& .MuiInputBase-input': {
            fontSize: isMobile ? '16px' : '14px',
            py: isMobile ? 1.5 : 1.2,
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: isMobile ? 2 : 1.5,
          },
        }
      })}
    >
      <Grid item xs={6}>
        <TextField 
          name="first_name" 
          label={t('forms.first_name')} 
          value={data.first_name} 
          onChange={onChange} 
          fullWidth 
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField 
          name="last_name" 
          label={t('forms.last_name')} 
          value={data.last_name} 
          onChange={onChange} 
          fullWidth 
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          name="email" 
          label={t('common.email')} 
          value={data.email} 
          onChange={onChange} 
          fullWidth 
          type="email"
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          name="phone" 
          label={t('common.phone')} 
          value={data.phone || ''} 
          onChange={onChange} 
          fullWidth 
        />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          name="address" 
          label={t('common.address')} 
          value={data.address || ''} 
          onChange={onChange} 
          fullWidth 
          multiline 
          rows={2} 
        />
      </Grid>
    </Grid>
  );
};