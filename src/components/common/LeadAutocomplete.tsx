import React, { useState, useMemo } from 'react';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import { useList } from '@refinedev/core';
import { useTranslation } from 'react-i18next';
import { Lead } from '../../types/lead';
import { LeadOption } from '../../types/flexibleEnrollment';

interface LeadAutocompleteProps {
  value?: string;
  onChange: (leadId: string | null) => void;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const LeadAutocomplete: React.FC<LeadAutocompleteProps> = ({
  value,
  onChange,
  error,
  helperText,
  placeholder,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  // Fetch leads with search - only qualified and contacted leads
  const { data: leadsData, isLoading } = useList<Lead>({
    resource: 'leads',
    pagination: { mode: 'off' },
    filters: [
      {
        field: 'status',
        operator: 'in',
        value: ['qualified', 'contacted'] // Only convertible leads
      },
      ...(searchText ? [{
        field: 'search',
        operator: 'contains',
        value: searchText
      }] : [])
    ]
  });

  // Transform leads to options
  const leadOptions: LeadOption[] = useMemo(() => {
    if (!leadsData?.data) return [];
    
    return leadsData.data
      .map(lead => ({
        value: lead.id,
        label: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        activity_of_interest: lead.activity_of_interest
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [leadsData]);

  // Find selected option
  const selectedOption = leadOptions.find(option => option.value === value) || null;

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'success';
      case 'contacted': return 'info';
      default: return 'default';
    }
  };

  return (
    <Autocomplete
      options={leadOptions}
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
                label={t(`lead_status.${option.status}`)} 
                color={getStatusColor(option.status)}
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
          label={t('forms.lead')}
          placeholder={placeholder || t('search.placeholder_leads')}
          error={error}
          helperText={helperText}
          required
        />
      )}
      noOptionsText={
        searchText ? t('search.no_leads_found') : t('search.type_to_search_leads')
      }
    />
  );
};