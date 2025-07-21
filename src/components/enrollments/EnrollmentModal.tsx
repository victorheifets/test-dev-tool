import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Enrollment, EnrollmentStatus, EnrollmentCreate } from '../../types/enrollment';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { EnrollmentForm } from '../forms/EnrollmentForm';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (enrollment: EnrollmentCreate) => void;
  initialData?: Enrollment | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const emptyEnrollment: EnrollmentCreate = {
  participant_id: '',
  activity_id: '',
  status: EnrollmentStatus.PENDING,
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  const [enrollment, setEnrollment] = useState<EnrollmentCreate>(emptyEnrollment);

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, enrollment_date, completion_percentage, days_remaining, is_active, ...data } = initialData;
      // Map Enrollment to EnrollmentCreate format
      const enrollmentCreate: EnrollmentCreate = {
        participant_id: data.participant_id,
        activity_id: data.activity_id,
        status: data.status,
        notes: data.notes,
        special_requirements: data.special_requirements,
      };
      setEnrollment(enrollmentCreate);
    } else {
      setEnrollment(emptyEnrollment);
    }
  }, [initialData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEnrollment(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSave = () => {
    // Only send data that's actually filled
    const enrollmentToSave: EnrollmentCreate = {
      ...enrollment,
      participant_id: enrollment.participant_id || `participant_${Date.now()}`,
    };
    onSave(enrollmentToSave);
  };

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('enrollment');
    if (mode === 'duplicate') return t('actions.duplicate') + ' ' + t('enrollment');
    return t('actions.create') + ' ' + t('enrollment');
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
      <EnrollmentForm data={enrollment} onChange={handleChange} />
    </CommonModalShell>
  );
}; 