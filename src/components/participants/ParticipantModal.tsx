import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Participant, ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { ParticipantForm } from '../forms/ParticipantForm';

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
    <CommonModalShell
      open={open}
      onClose={onClose}
      title={getTitle()}
      onSave={handleSave}
      forceMobile={forceMobile}
      maxWidth="sm"
      saveButtonText={t('actions.save')}
      cancelButtonText={t('actions.cancel')}
    >
      <ParticipantForm data={participant} onChange={handleChange} />
    </CommonModalShell>
  );
};
