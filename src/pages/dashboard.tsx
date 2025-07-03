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
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {t('dashboard.welcome')} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('courses')} value="12" icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.active_students')} value="156" icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.course_completion')} value="89%" icon={<TrendingUpIcon sx={{ fontSize: 40 }} />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.revenue')} value="$12.4k" icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />} color="warning" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('dashboard.recent_activity')}
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <List sx={{ width: '100%' }}>
                {mockData.recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.student}
                            </Typography>
                            <Chip 
                              label={activity.type} 
                              size="small" 
                              color={activity.type === 'completion' ? 'success' : 'primary'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.course}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
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
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.top_courses')}
              </Typography>
              {mockData.topCourses.map((course, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.enrolled}/{course.capacity}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={course.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
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
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('dashboard.upcoming_events')}
                </Typography>
                <EventIcon color="primary" />
              </Box>
              {mockData.upcomingEvents.map((event, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('dashboard.quick_actions')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <SchoolIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('actions.create')} {t('course')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <PersonIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('actions.create')} {t('student')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <EventIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {t('dashboard.schedule_event')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s'
                    }}
                  >
                    <NotificationsIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
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