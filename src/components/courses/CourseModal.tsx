import React, { useEffect } from 'react';
import { Activity, ActivityStatus, ActivityType } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { CourseForm } from '../forms/CourseForm';

// Import validation components and schema
import { useValidatedForm } from '../common/validated';
import { ActivityCreateSchema, type ActivityCreate } from '../../types/generated';

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: ActivityCreate) => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean; // Override mobile detection
}

const emptyActivity: ActivityCreate = {
  name: '',
  description: undefined,
  capacity: undefined,
  start_date: undefined,
  end_date: undefined,
  location: undefined,
  type: ActivityType.COURSE,
  status: ActivityStatus.DRAFT,
  price: undefined,
  currency: 'USD',
  category: undefined,
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  
  // Validation form hook - handles all form state and validation
  const validatedFormHook = useValidatedForm({
    schema: ActivityCreateSchema,
    defaultValues: emptyActivity,
    onSubmit: onSave,
  });

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, available_spots, is_fully_booked, ...data } = initialData;
      // Map Activity to ActivityCreate format
      const activityCreate: ActivityCreate = {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        type: data.activity_type,
        status: data.status,
        price: data.price,
        currency: data.currency,
        category: data.category,
      };
      validatedFormHook.reset(activityCreate);
    } else {
      validatedFormHook.reset(emptyActivity);
    }
  }, [initialData, open, validatedFormHook.reset]);

  // Use validation-first submission
  const handleSave = validatedFormHook.handleSubmit;

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
        validatedFormHook={validatedFormHook}
      />
    </CommonModalShell>
  );
};
