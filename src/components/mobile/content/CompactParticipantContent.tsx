import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Participant } from '../../../types/participant';
import { StatusChip } from '../../participants/StatusChip';
import { useTranslation } from 'react-i18next';
import { format, isValid } from 'date-fns';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';

interface CompactParticipantContentProps {
  participant: Participant;
}

export const CompactParticipantContent: React.FC<CompactParticipantContentProps> = ({ participant }) => {
  const { t } = useTranslation();

  const formatDate = (dateString?: string): string => {
    if (!dateString) return t('common.not_set', 'Not set');
    
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : t('common.invalid_date', 'Invalid date');
    } catch {
      return t('common.invalid_date', 'Invalid date');
    }
  };

  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || '?';
  };

  const fullName = `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || t('common.unnamed', 'Unnamed');

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mr: 1.5,
            backgroundColor: 'primary.main',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {getInitials(participant.first_name, participant.last_name)}
        </Avatar>
        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '200px',
              }}
            >
              {fullName}
            </Typography>
          </Box>
          
          <StatusChip isActive={participant.is_active} />
        </Box>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 1.5 }}>
        {participant.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                fontWeight: 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {participant.email}
            </Typography>
          </Box>
        )}
        
        {participant.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                fontWeight: 400
              }}
            >
              {participant.phone}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer Information */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pt: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {participant.enrollments_count || 0} {t('enrollments', 'enrollments')}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {formatDate(participant.created_at)}
        </Typography>
      </Box>
    </>
  );
};