import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  Slide,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TransitionProps } from '@mui/material/transitions';
import { Activity, ActivityStatus, ActivityType, ActivityCreate } from '../../types/activity';
import { useTranslation } from 'react-i18next';
import { format, parse, isValid } from 'date-fns';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CourseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (activity: ActivityCreate) => void;
  initialData?: Activity | null;
  mode: 'create' | 'edit' | 'duplicate';
  forceMobile?: boolean; // Override mobile detection
}

const ACTIVITY_STATUSES: ActivityStatus[] = [
  ActivityStatus.DRAFT, 
  ActivityStatus.PUBLISHED, 
  ActivityStatus.ONGOING, 
  ActivityStatus.COMPLETED, 
  ActivityStatus.CANCELLED
];
const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.COURSE, 
  ActivityType.WORKSHOP, 
  ActivityType.SEMINAR, 
  ActivityType.WEBINAR, 
  ActivityType.OTHER
];

const emptyActivity: ActivityCreate = {
  name: '',
  description: undefined,
  capacity: undefined,
  start_date: undefined,
  end_date: undefined,
  location: undefined,
  activity_type: ActivityType.COURSE,
  status: ActivityStatus.DRAFT,
  price: undefined,
  currency: 'USD',
  category: undefined,
};

export const CourseModal: React.FC<CourseModalProps> = ({ open, onClose, onSave, initialData, mode, forceMobile }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobileDetected = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = forceMobile !== undefined ? forceMobile : isMobileDetected;
  const [activity, setActivity] = useState<ActivityCreate>(emptyActivity);

  useEffect(() => {
    if (initialData) {
      const { id, provider_id, created_at, updated_at, is_active, enrollments_count, available_spots, is_fully_booked, ...data } = initialData;
      // Map Activity to ActivityCreate format
      const activityCreate: ActivityCreate = {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        activity_type: data.activity_type,
        status: data.status,
        price: data.price,
        currency: data.currency,
        category: data.category,
      };
      setActivity(activityCreate);
    } else {
      setActivity(emptyActivity);
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (field: 'start_date' | 'end_date', newValue: Date | null) => {
    if (newValue && isValid(newValue)) {
      const formattedDate = format(newValue, 'yyyy-MM-dd');
      setActivity(prev => ({
        ...prev,
        [field]: formattedDate
      }));
    } else {
      setActivity(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    try {
      const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  const handleSave = () => {
    if (typeof onSave !== 'function') {
      console.error('onSave is not a function');
      return;
    }
    
    // onSave now handles the async operation and modal closing
    onSave(activity);
  };

  const getTitle = () => {
    if (mode === 'edit') return t('actions.edit') + ' ' + t('course');
    if (mode === 'duplicate') return t('actions.duplicate', 'Duplicate') + ' ' + t('course');
    return t('actions.create') + ' ' + t('course');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isMobile ? false : "sm"} 
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
          margin: isMobile ? 0 : 3,
        }
      }}
    >
      <DialogTitle sx={{
        backgroundColor: isMobile ? 'primary.main' : 'transparent',
        color: isMobile ? 'white' : 'text.primary',
        fontWeight: 600,
        fontSize: isMobile ? '1.25rem' : '1.5rem',
        py: isMobile ? 2 : 1.5,
        borderBottom: '1px solid #e0e0e0',
      }}>
{getTitle()}
      </DialogTitle>
      <DialogContent sx={{
        backgroundColor: isMobile ? '#f8f9fa' : 'background.paper',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 2,
        maxHeight: isMobile ? 'none' : '70vh',
        overflow: 'auto',
      }}>
        <form id="course-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Grid container spacing={isMobile ? 3 : 2.5} sx={(theme) => ({
            mt: isMobile ? 0.5 : 0.5,
            direction: theme.direction,
            '& .MuiTextField-root': {
              '& .MuiInputLabel-root': {
                transformOrigin: theme.direction === 'rtl' ? 'top right' : 'top left',
              },
              '& .MuiInputBase-input': {
                fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
                py: isMobile ? 1.5 : 1.2,
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: isMobile ? 2 : 1.5,
              },
            },
            '& .MuiFormControl-root': {
              '& .MuiInputBase-root': {
                fontSize: isMobile ? '16px' : '14px',
                borderRadius: isMobile ? 2 : 1.5,
              },
            },
          })}>
            <Grid item xs={12} sm={8}>
              <TextField 
                name="name" 
                label={t('course_fields.name')} 
                value={activity.name} 
                onChange={handleChange} 
                fullWidth 
                required 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>{t('forms.type')}</InputLabel>
                <Select 
                  name="activity_type" 
                  value={activity.activity_type} 
                  onChange={handleChange} 
                  label={t('forms.type')}
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`activity_types.${type}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                name="description" 
                label={t('course_fields.description')} 
                value={activity.description || ''} 
                onChange={handleChange} 
                fullWidth 
                multiline 
                rows={3} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('course_fields.status')}</InputLabel>
                <Select 
                  name="status" 
                  value={activity.status} 
                  onChange={handleChange} 
                  label={t('course_fields.status')}
                >
                  {ACTIVITY_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`course_status.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="location" 
                label={t('course_fields.location')} 
                value={activity.location || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="capacity" 
                label={t('course_fields.capacity')} 
                type="number" 
                value={activity.capacity || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('course_fields.start_date')}
                  value={parseDate(activity.start_date)}
                  onChange={(newValue) => handleDateChange('start_date', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      inputProps: { 
                        style: { fontSize: isMobile ? '16px' : '14px' }
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: isMobile ? 2 : 1.5,
                        },
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('course_fields.end_date')}
                  value={parseDate(activity.end_date)}
                  onChange={(newValue) => handleDateChange('end_date', newValue)}
                  minDate={parseDate(activity.start_date) || undefined}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      inputProps: { 
                        style: { fontSize: isMobile ? '16px' : '14px' }
                      },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: isMobile ? 2 : 1.5,
                        },
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="price" 
                label={t('course_fields.price')} 
                type="number" 
                value={activity.price || ''} 
                onChange={handleChange} 
                fullWidth
                InputProps={{
                  startAdornment: activity.currency || 'USD'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                name="category" 
                label={t('course_fields.category')} 
                value={activity.category || ''} 
                onChange={handleChange} 
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{
        backgroundColor: isMobile ? 'background.paper' : 'transparent',
        px: isMobile ? 2 : 3,
        py: isMobile ? 2 : 1,
        gap: 1,
        borderTop: isMobile ? '1px solid' : 'none',
        borderColor: 'divider',
        flexDirection: isMobile ? 'column-reverse' : 'row',
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button 
          type="submit" 
          form="course-form" 
          variant="contained"
          fullWidth={isMobile}
          sx={{
            height: 48,
            minHeight: 48,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          {t('actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
