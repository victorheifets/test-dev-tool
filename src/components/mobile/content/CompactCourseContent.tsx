import React from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import { Activity } from '../../../types/activity';
import { StatusChip } from '../../courses/StatusChip';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface CompactCourseContentProps {
  activity: Activity;
}

export const CompactCourseContent: React.FC<CompactCourseContentProps> = ({ activity }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const price = activity.price || 0;
  const currency = activity.currency || 'USD';

  // Date formatting utility with null safety
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return t('common.not_set');
    try {
      const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : t('common.invalid_date');
    } catch {
      return t('common.invalid_date');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return theme.palette.success.main;
      case 'ongoing': return theme.palette.warning.main;
      case 'completed': return theme.palette.info.main;
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      {/* Course Avatar/Icon */}
      <Avatar
        sx={{
          width: 52,
          height: 52,
          bgcolor: getStatusColor(activity.status),
          flexShrink: 0,
          boxShadow: `0 4px 12px ${getStatusColor(activity.status)}40`,
          border: `2px solid ${getStatusColor(activity.status)}20`
        }}
      >
        <SchoolIcon sx={{ fontSize: 26, color: 'white' }} />
      </Avatar>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title and Status Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.3,
              flex: 1,
              mr: 1,
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
            noWrap
          >
            {activity.name}
          </Typography>
          <StatusChip status={activity.status} />
        </Box>

        {/* Course Type */}
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.85rem',
            textTransform: 'capitalize',
            mb: 1,
            color: getStatusColor(activity.status),
            fontWeight: 500
          }}
        >
          {activity.activity_type || t('course')}
        </Typography>

        {/* Compact Info Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap'
        }}>
          {/* Location */}
          {activity.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: theme.palette.text.primary, opacity: 0.7 }} />
              <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem' }}>
                {activity.location}
              </Typography>
            </Box>
          )}

          {/* Capacity */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 14, color: theme.palette.text.primary, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem' }}>
              {activity.enrollments_count || 0}/{activity.capacity || 0}
            </Typography>
          </Box>

          {/* Price */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: getStatusColor(activity.status),
              fontWeight: 700,
              ml: 'auto',
              fontSize: '0.8rem'
            }}
          >
            {price} {currency}
          </Typography>
        </Box>

        {/* Date Range */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          mt: 1
        }}>
          <DateRangeIcon sx={{ fontSize: 14, color: theme.palette.text.primary, opacity: 0.7 }} />
          <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem' }}>
            {formatDate(activity.start_date)} - {formatDate(activity.end_date)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};