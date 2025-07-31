import React, { useEffect } from 'react';
import { Participant, ParticipantCreate } from '../../types/participant';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { ParticipantForm } from '../forms/ParticipantForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ParticipantCreateSchema } from '../../types/generated/validation-schemas';

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
  date_of_birth: '',
  address: '',
};

export const ParticipantModal: React.FC<ParticipantModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  
  const form = useForm<ParticipantCreate>({
    resolver: zodResolver(ParticipantCreateSchema),
    defaultValues: emptyParticipant,
    mode: 'onChange', // Real-time validation
  });

  const { handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, ...data } = initialData;
      // Map Participant to ParticipantCreate format
      const participantCreate: ParticipantCreate = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
      };
      reset(participantCreate);
    } else {
      reset(emptyParticipant);
    }
  }, [initialData, open, reset]);

  const handleSave = handleSubmit((data: ParticipantCreate) => {
    onSave(data);
  });

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
      <ParticipantForm form={form} errors={errors} />
    </CommonModalShell>
  );
};
