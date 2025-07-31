import React, { useState, useMemo } from 'react';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import { useList } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import { Participant } from '../../types/participant';
import { ParticipantOption } from '../../types/flexibleEnrollment';

interface ParticipantAutocompleteProps {
  value?: string;
  onChange: (participantId: string | null) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ParticipantAutocomplete: React.FC<ParticipantAutocompleteProps> = ({
  value,
  onChange,
  error,
  helperText,
  placeholder,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  // Fetch participants with search
  const { data: participantsData, isLoading } = useList<Participant>({
    resource: 'participants',
    pagination: { mode: 'off' },
    filters: searchText ? [
      {
        field: 'search',
        operator: 'contains',
        value: searchText
      }
    ] : []
  });

  // Transform participants to options
  const participantOptions: ParticipantOption[] = useMemo(() => {
    if (!participantsData?.data) return [];
    
    return participantsData.data
      .filter(p => p.is_active) // Only show active participants
      .map(participant => ({
        value: participant.id,
        label: `${participant.first_name} ${participant.last_name}`,
        email: participant.email,
        phone: participant.phone,
        is_active: participant.is_active
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [participantsData]);

  // Find selected option
  const selectedOption = participantOptions.find(option => option.value === value) || null;

  return (
    <Autocomplete
      options={participantOptions}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue?.value || null);
      }}
      onInputChange={(_, newInputValue) => {
        setSearchText(newInputValue);
      }}
      loading={isLoading}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      filterOptions={(x) => x} // We handle filtering via API
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                {option.label}
              </Typography>
              <Chip 
                size="small" 
                label={option.is_active ? t('common.active') : t('status_options.inactive')} 
                color={option.is_active ? 'success' : 'default'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {option.email}
            </Typography>
            {option.phone && (
              <Typography variant="caption" color="text.secondary">
                {option.phone}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('forms.participant')}
          placeholder={placeholder || t('search.placeholder_participants')}
          error={error}
          helperText={helperText}
          required
        />
      )}
      noOptionsText={
        searchText ? t('search.no_participants_found') : t('search.type_to_search_participants')
      }
    />
  );
};