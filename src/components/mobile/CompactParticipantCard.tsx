import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import { Participant } from '../../types/participant';
import { StatusChip } from '../participants/StatusChip';
import { ActionMenu } from '../participants/ActionMenu';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';

interface CompactParticipantCardProps {
  participant: Participant;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompactParticipantCard: React.FC<CompactParticipantCardProps> = ({
  participant,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle swipe gestures
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const distance = currentX - startX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left to edit
      onEdit(participant.id);
    } else if (isRightSwipe) {
      // Swipe right to delete
      onDelete(participant.id);
    }

    setStartX(0);
    setCurrentX(0);
  };

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
    <Card
      sx={{
        mb: 1.5,
        mx: 0.5,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
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
              
              <ActionMenu
                onEdit={() => onEdit(participant.id)}
                onDuplicate={() => onDuplicate(participant.id)}
                onDelete={() => onDelete(participant.id)}
              />
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
      </CardContent>

      {/* Swipe Indicators */}
      {isDragging && (
        <>
          {/* Left swipe indicator (Edit) */}
          {currentX - startX > 20 && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: Math.min((currentX - startX) * 2, 80),
                backgroundColor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: Math.min((currentX - startX) / 50, 1),
                transition: 'opacity 0.1s ease-out',
              }}
            >
              <Typography variant="caption" color="white" sx={{ fontWeight: 600 }}>
                {t('actions.edit', 'Edit')}
              </Typography>
            </Box>
          )}

          {/* Right swipe indicator (Delete) */}
          {startX - currentX > 20 && (
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: Math.min((startX - currentX) * 2, 80),
                backgroundColor: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: Math.min((startX - currentX) / 50, 1),
                transition: 'opacity 0.1s ease-out',
              }}
            >
              <Typography variant="caption" color="white" sx={{ fontWeight: 600 }}>
                {t('actions.delete', 'Delete')}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

export default CompactParticipantCard;