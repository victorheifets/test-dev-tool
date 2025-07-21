import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Enrollment } from '../../../types/enrollment';
import { StatusChip } from '../../enrollments/StatusChip';
import { useTranslation } from 'react-i18next';
import { format, isValid } from 'date-fns';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PercentIcon from '@mui/icons-material/Percent';

interface CompactEnrollmentContentProps {
  enrollment: Enrollment;
}

export const CompactEnrollmentContent: React.FC<CompactEnrollmentContentProps> = ({ enrollment }) => {
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'completed': return '#2196F3';
      case 'waitlisted': return '#9C27B0';
      default: return '#757575';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            mr: 1.5,
            backgroundColor: getStatusColor(enrollment.status),
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          <PersonIcon sx={{ fontSize: 24 }} />
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
              {enrollment.participant_id}
            </Typography>
          </Box>
          
          <StatusChip status={enrollment.status} />
        </Box>
      </Box>

      {/* Course Information */}
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {enrollment.activity_id}
          </Typography>
        </Box>
        
        {enrollment.enrollment_date && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {t('enrollment.enrolled_on')}: {formatDate(enrollment.enrollment_date)}
            </Typography>
          </Box>
        )}

        {enrollment.completion_percentage !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PercentIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {t('enrollment.progress')}: {enrollment.completion_percentage}%
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
        {enrollment.days_remaining !== undefined && enrollment.days_remaining > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {enrollment.days_remaining} {t('common.days_remaining')}
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 'auto' }}>
          {formatDate(enrollment.created_at)}
        </Typography>
      </Box>

      {/* Notes */}
      {enrollment.notes && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
            {enrollment.notes}
          </Typography>
        </Box>
      )}
    </>
  );
};