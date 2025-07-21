import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lead } from '../../../types/lead';
import { StatusChip } from '../../leads/StatusChip';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SourceIcon from '@mui/icons-material/Source';

interface CompactLeadContentProps {
  lead: Lead;
}

export const CompactLeadContent: React.FC<CompactLeadContentProps> = ({ lead }) => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <PersonIcon color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {lead.first_name} {lead.last_name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
        {lead.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {lead.email}
            </Typography>
          </Box>
        )}
        
        {lead.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {lead.phone}
            </Typography>
          </Box>
        )}
        
        {lead.source && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SourceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusChip status={lead.status} />
        <Typography variant="caption" color="text.secondary">
          {new Date(lead.created_at).toLocaleDateString()}
        </Typography>
      </Box>
    </>
  );
};