import React, { useEffect } from 'react';
import { Activity, ActivityStatus, ActivityType } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { CourseForm } from '../forms/CourseForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityCreateSchema, ActivityCreate } from '../../types/generated/validation-schemas';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: any) => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const emptyActivity: ActivityCreate = {
  name: '',
  description: '',
  capacity: 0,
  start_date: '',
  end_date: '',
  location: '',
  type: ActivityType.COURSE,
  status: ActivityStatus.DRAFT,
  price: 0,
  currency: 'USD',
  category: '',
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  
  const form = useForm<ActivityCreate>({
    resolver: zodResolver(ActivityCreateSchema),
    defaultValues: emptyActivity,
    mode: 'onChange', // Real-time validation
  });

  const { handleSubmit, reset, formState: { errors, isValid } } = form;

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, available_spots, is_fully_booked, ...data } = initialData;
      reset({
        name: data.name || '',
        description: data.description || '',
        capacity: data.capacity || 0,
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        location: data.location || '',
        type: data.activity_type || ActivityType.COURSE,
        status: data.status || ActivityStatus.DRAFT,
        price: data.price || 0,
        currency: data.currency || 'USD',
        category: data.category || '',
      });
    } else {
      reset(emptyActivity);
    }
  }, [initialData, open, reset]);

  const handleSave = handleSubmit((data: ActivityCreate) => {
    onSave(data);
  });

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('course');
    if (mode === 'duplicate') return t('actions.duplicate', 'Duplicate') + ' ' + t('course');
    return t('actions.create') + ' ' + t('course');
  };

  return (
    <CommonModalShell
      open={open}
      onClose={onClose}
      title={getTitle()}
      onSave={handleSave}
      forceMobile={forceMobile}
      maxWidth="md"
      saveButtonText={t('actions.save')}
      cancelButtonText={t('actions.cancel')}
    >
      <CourseForm 
        form={form}
        errors={errors}
      />
    </CommonModalShell>
  );
};