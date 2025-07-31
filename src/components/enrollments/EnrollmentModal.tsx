import React, { useEffect, useState } from 'react';
import { Enrollment, EnrollmentStatus } from '../../types/enrollment';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { EnrollmentForm } from '../forms/EnrollmentForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnrollmentCreateSchema, EnrollmentCreate } from '../../types/generated/validation-schemas';
import { EnrollmentMode, FlexibleEnrollmentData } from '../../types/flexibleEnrollment';

interface EnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (enrollment: FlexibleEnrollmentData) => void;
  initialData?: Enrollment | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const emptyEnrollment: EnrollmentCreate = {
  participant_id: '',
  activity_id: '',
  status: EnrollmentStatus.PENDING,
  enrollment_date: '',
  notes: '',
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  
  // State for flexible enrollment
  const [enrollmentMode, setEnrollmentMode] = useState<EnrollmentMode>('existing');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [participantData, setParticipantData] = useState<any>(null);
  
  const form = useForm<EnrollmentCreate>({
    resolver: zodResolver(EnrollmentCreateSchema),
    defaultValues: emptyEnrollment,
    mode: 'onChange', // Real-time validation
  });

  const { reset, formState: { errors }, getValues } = form;

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, enrollment_date, completion_percentage, days_remaining, is_active, ...data } = initialData;
      // Map Enrollment to EnrollmentCreate format
      const enrollmentCreate: EnrollmentCreate = {
        participant_id: data.participant_id || '',
        activity_id: data.activity_id || '',
        status: (data.status as string) || EnrollmentStatus.PENDING,
        enrollment_date: new Date().toISOString().split('T')[0], // Use current date if not present
        notes: data.notes || '',
      };
      reset(enrollmentCreate);
    } else {
      reset(emptyEnrollment);
    }
  }, [initialData, open, reset]);

  const handleSave = () => {
    // Check if we can save based on enrollment mode
    if (enrollmentMode === 'existing' && !selectedParticipantId) {
      return; // Cannot save without participant selection
    }
    if (enrollmentMode === 'new' && !participantData) {
      return; // Cannot save without valid participant data
    }
    if (enrollmentMode === 'from_lead' && !selectedLeadId) {
      return; // Cannot save without lead selection
    }

    // Get form data
    const formData = form.getValues();
    
    // Validate required fields
    if (!formData.activity_id) {
      return; // Cannot save without activity
    }

    // Construct flexible enrollment data based on mode
    let flexibleData: FlexibleEnrollmentData;
    
    if (enrollmentMode === 'existing') {
      flexibleData = {
        mode: 'existing',
        participant_id: selectedParticipantId!,
        activity_id: formData.activity_id,
        status: formData.status,
        notes: formData.notes,
      };
    } else if (enrollmentMode === 'new') {
      flexibleData = {
        mode: 'new',
        participant_data: participantData!,
        activity_id: formData.activity_id,
        status: formData.status,
        notes: formData.notes,
      };
    } else { // from_lead
      flexibleData = {
        mode: 'from_lead',
        lead_id: selectedLeadId!,
        activity_id: formData.activity_id,
        status: formData.status,
        notes: formData.notes,
      };
    }
    
    onSave(flexibleData);
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
      <EnrollmentForm 
        form={form} 
        errors={errors}
        onModeChange={setEnrollmentMode}
        onParticipantSelect={setSelectedParticipantId}
        onLeadSelect={setSelectedLeadId}
        onParticipantData={setParticipantData}
      />
    </CommonModalShell>
  );
}; 