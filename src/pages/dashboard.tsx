import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Skeleton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { StatCard } from '../components/StatCard';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useDashboard } from '../hooks/useDashboard';
import { CourseModal } from '../components/courses/CourseModal';
import { ParticipantModal } from '../components/participants/ParticipantModal';
import { SmsModal } from '../components/messaging/SmsModal';
import { RegistrationFormModal } from '../components/registrationForm/RegistrationFormModal';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';



export const Dashboard = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { data, loading, error, refresh } = useDashboard();
  
  // Modal states
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [registrationFormModalOpen, setRegistrationFormModalOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create_course':
        setCourseModalOpen(true);
        break;
      case 'create_student':
        setParticipantModalOpen(true);
        break;
      case 'create_form':
        setRegistrationFormModalOpen(true);
        break;
      case 'send_alert':
        setSmsModalOpen(true);
        break;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };
  
  return (
    <Box sx={{ width: '100%', p: isMobile ? 1 : 0 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: isMobile ? 3 : 4, px: isMobile ? 1 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
            {t('dashboard.welcome')} 👋
          </Typography>
          {!loading && (
            <IconButton onClick={refresh} color="primary" size="small">
              <RefreshIcon />
            </IconButton>
          )}
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error} - Showing cached or default data.
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 3 : 4, px: isMobile ? 1 : 0 }}>
        <Grid item xs={6} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title={t('courses')} 
              value={data?.stats.totalCourses?.toString() || '0'} 
              icon={<SchoolIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} 
              color="primary" 
            />
          )}
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title={t('dashboard.active_students')} 
              value={data?.stats.activeStudents.toString() || '0'} 
              icon={<PeopleIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} 
              color="success" 
            />
          )}
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title={t('dashboard.course_completion')} 
              value={formatPercentage(data?.stats.completionRate || 0)} 
              icon={<TrendingUpIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} 
              color="info" 
            />
          )}
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard 
              title={t('dashboard.revenue')} 
              value={formatCurrency(data?.stats.revenue || 0)} 
              icon={<AttachMoneyIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} 
              color="warning" 
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={isMobile ? 2 : 3} sx={{ px: isMobile ? 1 : 0 }}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-component" sx={{ height: '100%', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                  {t('dashboard.recent_activity')}
                </Typography>
                {loading && <CircularProgress size={20} />}
              </Box>
              
              {loading ? (
                <Box>
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <List sx={{ width: '100%' }}>
                  {data?.recentActivity.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No recent activity
                    </Typography>
                  ) : (
                    data?.recentActivity.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0, py: isMobile ? 1 : 1.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main', width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}>
                              {activity.avatar}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.875rem' : '0.875rem' }}>
                                  {activity.student}
                                </Typography>
                                <Chip 
                                  label={activity.type} 
                                  size="small" 
                                  color={activity.type === 'completion' ? 'success' : activity.type === 'lead' ? 'warning' : 'primary'}
                                  variant="outlined"
                                  sx={{ fontSize: isMobile ? '0.75rem' : '0.8125rem' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                                  {activity.course}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.75rem' }}>
                                  {activity.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < (data?.recentActivity.length || 0) - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Courses */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-component" sx={{ height: '100%', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.top_courses')}
              </Typography>
              
              {loading ? (
                <Box>
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} sx={{ mb: 3 }}>
                      <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={8} sx={{ mb: 1, borderRadius: 4 }} />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box>
                  {data?.topCourses.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No courses available
                    </Typography>
                  ) : (
                    data?.topCourses.map((course, index) => (
                      <Box key={course.id} sx={{ mb: isMobile ? 2.5 : 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.875rem' : '0.875rem' }}>
                            {course.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : '0.875rem' }}>
                            {course.enrolled}/{course.capacity}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ 
                            height: isMobile ? 6 : 8, 
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: isMobile ? '0.75rem' : '0.75rem' }}>
                          {course.progress}% {t('dashboard.enrolled')}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-component" sx={{ height: '100%', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                  {t('dashboard.upcoming_events')}
                </Typography>
                <EventIcon color="primary" sx={{ fontSize: isMobile ? 20 : 24 }} />
              </Box>
              
              {loading ? (
                <Box>
                  {[1, 2, 3].map((item) => (
                    <Skeleton 
                      key={item} 
                      variant="rectangular" 
                      height={60} 
                      sx={{ mb: 2, borderRadius: 1 }} 
                    />
                  ))}
                </Box>
              ) : (
                <Box>
                  {data?.upcomingEvents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      No upcoming courses scheduled.<br/>
                      <Typography variant="caption" color="text.secondary">
                        Create courses with future start dates to see them here.
                      </Typography>
                    </Typography>
                  ) : (
                    data?.upcomingEvents.map((event) => (
                      <Box key={event.id} sx={{ mb: 2, p: isMobile ? 1.5 : 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.875rem' : '0.875rem' }}>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.75rem' }}>
                          {event.date} at {event.time}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-component" sx={{ height: '100%', backgroundColor: 'background.paper' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.quick_actions')}
              </Typography>
              <Grid container spacing={isMobile ? 1.5 : 2}>
                <Grid item xs={6}>
                  <Paper 
                    onClick={() => handleQuickAction('create_course')}
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      backgroundColor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <SchoolIcon color="primary" sx={{ fontSize: isMobile ? 24 : 32, mb: isMobile ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {t('actions.create')} {t('course')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    onClick={() => handleQuickAction('create_student')}
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      backgroundColor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <PersonIcon color="success" sx={{ fontSize: isMobile ? 24 : 32, mb: isMobile ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {t('actions.create')} {t('student')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    onClick={() => handleQuickAction('create_form')}
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      backgroundColor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <EventIcon color="info" sx={{ fontSize: isMobile ? 24 : 32, mb: isMobile ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {t('registrationForm.createForm')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    onClick={() => handleQuickAction('send_alert')}
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      backgroundColor: 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <NotificationsIcon color="warning" sx={{ fontSize: isMobile ? 24 : 32, mb: isMobile ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {t('dashboard.send_alert')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      <CourseModal 
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        forceMobile={isMobile}
        onSave={() => {
          setCourseModalOpen(false);
          refresh(); // Refresh dashboard data
        }}
        initialData={null}
        mode="create"
      />
      
      <ParticipantModal 
        open={participantModalOpen}
        onClose={() => setParticipantModalOpen(false)}
        forceMobile={isMobile}
        onSave={() => {
          setParticipantModalOpen(false);
          refresh(); // Refresh dashboard data
        }}
        initialData={null}
        mode="create"
      />
      
      <SmsModal 
        open={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
        forceMobile={isMobile}
        onSave={() => {
          setSmsModalOpen(false);
          // No need to refresh dashboard for SMS
        }}
      />
      
      <RegistrationFormModal 
        open={registrationFormModalOpen}
        onClose={() => setRegistrationFormModalOpen(false)}
        forceMobile={isMobile}
        onSave={() => {
          setRegistrationFormModalOpen(false);
          // No need to refresh dashboard for registration form
        }}
        initialData={null}
        mode="create"
      />
    </Box>
  );
}; 