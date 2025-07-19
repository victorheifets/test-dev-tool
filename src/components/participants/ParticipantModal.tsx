import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, useMediaQuery, useTheme, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Participant, ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ParticipantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (participant: ParticipantCreate) => void;
  initialData?: Participant | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const emptyParticipant: ParticipantCreate = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
};

export const ParticipantModal: React.FC<ParticipantModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobileDetected = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = forceMobile !== undefined ? forceMobile : isMobileDetected;
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
        date_of_birth: data.date_of_birth,
        address: data.address,
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
      maxWidth={isMobile ? false : "sm"} 
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
          margin: isMobile ? 0 : 3,
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: isMobile ? 'primary.main' : 'transparent',
        color: isMobile ? 'white' : 'text.primary',
        fontWeight: 600,
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        py: isMobile ? 2 : 1.5,
        borderBottom: '1px solid #e0e0e0',
      }}>{getTitle()}</DialogTitle>
      <DialogContent sx={{
        backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 2,
        maxHeight: isMobile ? 'none' : '70vh',
        overflow: 'auto',
      }}>
        <Grid container spacing={isMobile ? 3 : 2} sx={(theme) => ({
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
      <DialogActions sx={{
        backgroundColor: isMobile ? 'background.paper' : 'transparent',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 1,
        gap: 1,
        borderTop: isMobile ? '1px solid' : 'none',
        borderColor: 'divider',
        flexDirection: isMobile ? 'column-reverse' : 'row',
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
