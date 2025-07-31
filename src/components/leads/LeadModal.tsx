import React, { useEffect } from 'react';
import { Lead, LeadSource, LeadStatus } from '../../types/lead';
import { useTranslation } from 'react-i18next';
import { CommonModalShell } from '../common/CommonModalShell';
import { LeadForm } from '../forms/LeadForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadCreateSchema, LeadCreate } from '../../types/generated/validation-schemas';
import { z } from 'zod';
import { getProviderIdFromToken } from '../../config/api';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id'>) => void;
  initialData?: Lead | Omit<Lead, 'id'> | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean;
}

const emptyLead: LeadCreate = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  source: LeadSource.WEBSITE,
  status: LeadStatus.NEW,
  activity_of_interest: '',
  notes: '',
};

export const LeadModal: React.FC<LeadModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  
  const form = useForm<LeadCreate>({
    resolver: zodResolver(LeadCreateSchema),
    defaultValues: emptyLead,
    mode: 'onChange', // Real-time validation
  });

  const { handleSubmit, reset, formState: { errors } } = form;

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, ...data } = initialData as Lead;
      // Map Lead to LeadCreate format
      const leadCreate: LeadCreate = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        source: data.source || LeadSource.WEBSITE,
        status: data.status || LeadStatus.NEW,
        activity_of_interest: data.activity_of_interest || '',
        notes: data.notes || '',
      };
      reset(leadCreate);
    } else {
      reset(emptyLead);
    }
  }, [initialData, open, reset]);

  const handleSave = handleSubmit((data: LeadCreate) => {
    // Get provider ID from JWT token
    const providerId = getProviderIdFromToken();
    
    if (!providerId) {
      console.error('No provider ID available from JWT token');
      // Handle error - could show notification or fallback
      return;
    }

    // Transform empty strings to undefined for optional fields to satisfy validation
    // The schema requires notes to have at least 1 character when provided,
    // but empty strings should be treated as "not provided" for optional fields
    const cleanedData = {
      ...data,
      notes: data.notes?.trim() === '' ? undefined : data.notes,
      activity_of_interest: data.activity_of_interest || undefined
    };

    // Convert LeadCreate to the expected Lead format
    const leadData: Omit<Lead, 'id'> = {
      provider_id: providerId,
      first_name: cleanedData.first_name,
      last_name: cleanedData.last_name,
      email: cleanedData.email,
      phone: cleanedData.phone || '',
      source: cleanedData.source as LeadSource || LeadSource.WEBSITE,
      status: cleanedData.status as LeadStatus || LeadStatus.NEW,
      activity_of_interest: cleanedData.activity_of_interest || '',
      notes: cleanedData.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };
    onSave(leadData);
  });

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('lead');
    if (mode === 'duplicate') return t('actions.duplicate') + ' ' + t('lead');
    return t('actions.create') + ' ' + t('lead');
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
      <LeadForm 
        form={form}
        errors={errors}
      />
    </CommonModalShell>
  );
};