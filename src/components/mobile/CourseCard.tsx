import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PeopleIcon from '@mui/icons-material/People';
import { Activity } from '../../types/activity';
import { StatusChip } from '../courses/StatusChip';
import { ActionMenu } from '../courses/ActionMenu';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';

interface CourseCardProps {
  course: Activity;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <Card 
      sx={{ 
        mb: isMobile ? 1.5 : 2,
        mx: isMobile ? 0.5 : 0,
        borderRadius: isMobile ? 3 : 2,
        boxShadow: isMobile 
          ? '0 4px 12px rgba(0,0,0,0.15)' 
          : '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: isMobile 
            ? '0 6px 20px rgba(0,0,0,0.2)' 
            : '0 4px 12px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <CardContent sx={{ 
        pb: 1,
        p: isMobile ? 2 : 3
      }}>
        {/* Header with title and menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: isMobile ? 1.5 : 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                mb: 0.5,
                lineHeight: 1.3
              }}
            >
              {course.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textTransform: 'capitalize',
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}
            >
              {course.activity_type || t('course')}
            </Typography>
          </Box>
          <Box sx={{ ml: 1, flexShrink: 0 }}>
            <ActionMenu
              onEdit={() => onEdit(course.id)}
              onDuplicate={() => onDuplicate(course.id)}
              onDelete={() => onDelete(course.id)}
            />
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ mb: isMobile ? 1.5 : 2 }}>
          <StatusChip status={course.status} />
        </Box>

        <Divider sx={{ my: isMobile ? 1.5 : 2 }} />

        {/* Course Details Grid */}
        <Grid container spacing={isMobile ? 1.5 : 2}>
          {/* Location */}
          {course.location && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'text.secondary' }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                >
                  {course.location}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Dates */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRangeIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
              >
                {formatDate(course.start_date)} - {formatDate(course.end_date)}
              </Typography>
            </Box>
          </Grid>

          {/* Capacity */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ fontSize: isMobile ? 16 : 18, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
              >
                {course.enrollments_count || 0} / {course.capacity || 0}
              </Typography>
            </Box>
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'right',
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                fontWeight: 600
              }}
            >
              {price} {currency}
            </Typography>
          </Grid>

          {/* Trainer */}
          {/* Note: trainer_id removed from Activity type - implement instructor management separately */}
        </Grid>
      </CardContent>
    </Card>
  );
};