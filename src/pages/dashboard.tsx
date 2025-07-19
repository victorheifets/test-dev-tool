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
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StatCard } from '../components/StatCard';
import { useBreakpoint } from '../hooks/useBreakpoint';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Mock data for demonstration
const mockData = {
  recentActivity: [
    { id: 1, type: 'enrollment', student: 'John Doe', course: 'React Fundamentals', time: '2 hours ago', avatar: 'JD' },
    { id: 2, type: 'completion', student: 'Sarah Wilson', course: 'JavaScript Advanced', time: '4 hours ago', avatar: 'SW' },
    { id: 3, type: 'enrollment', student: 'Mike Johnson', course: 'Node.js Basics', time: '6 hours ago', avatar: 'MJ' },
    { id: 4, type: 'lead', student: 'Emma Brown', course: 'Vue.js Course', time: '1 day ago', avatar: 'EB' },
  ],
  topCourses: [
    { name: 'React Fundamentals', enrolled: 45, capacity: 50, progress: 90 },
    { name: 'JavaScript Advanced', enrolled: 38, capacity: 40, progress: 95 },
    { name: 'Node.js Basics', enrolled: 22, capacity: 30, progress: 73 },
    { name: 'Vue.js Course', enrolled: 15, capacity: 25, progress: 60 },
  ],
  upcomingEvents: [
    { title: 'React Workshop', date: 'Dec 15, 2024', time: '10:00 AM' },
    { title: 'JavaScript Assessment', date: 'Dec 18, 2024', time: '2:00 PM' },
    { title: 'Career Fair', date: 'Dec 22, 2024', time: '9:00 AM' },
  ]
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  
  return (
    <Box sx={{ width: '100%', p: isMobile ? 1 : 0 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: isMobile ? 3 : 4, px: isMobile ? 1 : 0 }}>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600, mb: 1 }}>
          {t('dashboard.welcome')} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: isMobile ? 3 : 4, px: isMobile ? 1 : 0 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('courses')} value="12" icon={<SchoolIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('dashboard.active_students')} value="156" icon={<PeopleIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} color="success" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('dashboard.course_completion')} value="89%" icon={<TrendingUpIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} color="info" />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title={t('dashboard.revenue')} value="$12.4k" icon={<AttachMoneyIcon sx={{ fontSize: isMobile ? 32 : 40 }} />} color="warning" />
        </Grid>
      </Grid>

      <Grid container spacing={isMobile ? 2 : 3} sx={{ px: isMobile ? 1 : 0 }}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                  {t('dashboard.recent_activity')}
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <List sx={{ width: '100%' }}>
                {mockData.recentActivity.map((activity, index) => (
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
                              color={activity.type === 'completion' ? 'success' : 'primary'}
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
                    {index < mockData.recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Courses */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.top_courses')}
              </Typography>
              {mockData.topCourses.map((course, index) => (
                <Box key={index} sx={{ mb: isMobile ? 2.5 : 3 }}>
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
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                  {t('dashboard.upcoming_events')}
                </Typography>
                <EventIcon color="primary" sx={{ fontSize: isMobile ? 20 : 24 }} />
              </Box>
              {mockData.upcomingEvents.map((event, index) => (
                <Box key={index} sx={{ mb: 2, p: isMobile ? 1.5 : 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.875rem' : '0.875rem' }}>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : '0.75rem' }}>
                    {event.date} at {event.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.quick_actions')}
              </Typography>
              <Grid container spacing={isMobile ? 1.5 : 2}>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
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
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
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
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <EventIcon color="info" sx={{ fontSize: isMobile ? 24 : 32, mb: isMobile ? 0.5 : 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {t('dashboard.schedule_event')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
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
    </Box>
  );
}; 