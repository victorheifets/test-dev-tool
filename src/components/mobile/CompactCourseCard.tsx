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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import { Activity } from '../../types/activity';
import { StatusChip } from '../courses/StatusChip';
import { ActionMenu } from '../courses/ActionMenu';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';

interface CompactCourseCardProps {
  course: Activity;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompactCourseCard: React.FC<CompactCourseCardProps> = ({
  course,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const price = course.price || 0;
  const currency = course.currency || 'USD';

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

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left to edit
      onEdit(course.id);
    } else if (isRightSwipe) {
      // Swipe right to delete
      onDelete(course.id);
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
    <Card 
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      sx={{ 
        mb: 0.75,
        mx: 0,
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: 'none',
        backgroundColor: '#ffffff',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        cursor: isMobile ? 'grab' : 'default',
        '&:active': {
          cursor: isMobile ? 'grabbing' : 'default',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${getStatusColor(course.status)}, ${getStatusColor(course.status)}aa)`,
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Main Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Course Avatar/Icon */}
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: getStatusColor(course.status),
              flexShrink: 0,
              boxShadow: `0 4px 12px ${getStatusColor(course.status)}40`,
              border: `2px solid ${getStatusColor(course.status)}20`
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
                {course.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StatusChip status={course.status} />
                <ActionMenu
                  onEdit={() => onEdit(course.id)}
                  onDuplicate={() => onDuplicate(course.id)}
                  onDelete={() => onDelete(course.id)}
                />
              </Box>
            </Box>

            {/* Course Type */}
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                mb: 1,
                color: getStatusColor(course.status),
                fontWeight: 500
              }}
            >
              {course.activity_type || t('course')}
            </Typography>

            {/* Compact Info Row */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap'
            }}>
              {/* Location */}
              {course.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14, color: theme.palette.text.primary, opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem' }}>
                    {course.location}
                  </Typography>
                </Box>
              )}

              {/* Capacity */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleIcon sx={{ fontSize: 14, color: theme.palette.text.primary, opacity: 0.7 }} />
                <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem' }}>
                  {course.enrollments_count || 0}/{course.capacity || 0}
                </Typography>
              </Box>

              {/* Price */}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: getStatusColor(course.status),
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
                {formatDate(course.start_date)} - {formatDate(course.end_date)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};