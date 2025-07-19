import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import { Enrollment } from '../../types/enrollment';
import { StatusChip } from '../enrollments/StatusChip';
import { ActionMenu } from '../enrollments/ActionMenu';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';

interface CompactEnrollmentCardProps {
  enrollment: Enrollment;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompactEnrollmentCard: React.FC<CompactEnrollmentCardProps> = ({
  enrollment,
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
      onEdit(enrollment.id);
    } else if (isRightSwipe) {
      // Swipe right to delete
      onDelete(enrollment.id);
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

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const completionPercentage = enrollment.completion_percentage || 0;
  const paymentStatus = 'pending'; // TODO: Add payment_status to enrollment type

  const getPaymentColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'paid': return theme.palette.success.main;
      case 'pending': return theme.palette.warning.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

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
            <SchoolIcon />
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
                {t('enrollment')} #{enrollment.id}
              </Typography>
              
              <ActionMenu
                onEdit={() => onEdit(enrollment.id)}
                onDuplicate={() => onDuplicate(enrollment.id)}
                onDelete={() => onDelete(enrollment.id)}
              />
            </Box>
            
            <StatusChip status={enrollment.status} />
          </Box>
        </Box>

        {/* Enrollment Details */}
        <Box sx={{ mb: 1.5 }}>
          {enrollment.participant_id && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
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
                {t('forms.participant_id')}: {enrollment.participant_id}
              </Typography>
            </Box>
          )}
          
          {enrollment.activity_id && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                {t('forms.activity_id')}: {enrollment.activity_id}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {t('forms.enrollment_date')}: {formatDate(enrollment.enrollment_date)}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        {completionPercentage > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {t('forms.progress')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {completionPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProgressColor(completionPercentage),
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

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
            <PaymentIcon sx={{ fontSize: 16, color: getPaymentColor(paymentStatus), mr: 0.5 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                color: getPaymentColor(paymentStatus),
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {paymentStatus}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {formatDate(enrollment.enrollment_date)}
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

export default CompactEnrollmentCard;